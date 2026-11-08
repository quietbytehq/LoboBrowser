#!/usr/bin/env python3
"""Lobster Browser speed test: startup time and memory vs. stock Firefox and Brave.

Startup time = seconds from launching the browser until it requests a local test
page from a tiny HTTP server started by this script (time to first page request).
  * "first launch": a brand-new empty profile each run
  * "repeat launch": the same profile, launched again
Memory = total PSS (proportional set size, so shared memory is not double-counted)
of the whole browser process tree, 25 s after opening the same 5 websites.

All browsers run headless with fresh profiles, one at a time, with nothing else heavy
running. Results are medians of several runs. Usage: speedtest.py <out.json>   (add --memory-only to redo just the memory part)
"""
import http.server, json, os, shutil, signal, socketserver, statistics, subprocess, sys, tempfile, threading, time

HOME = os.path.expanduser("~")
LOBSTER = f"{HOME}/projects/quietbyte/LoboBrowser/browser/engine/obj-x86_64-pc-linux-gnu/dist/bin/lobster"
BROWSERS = {
    "Lobster 0.1 (Firefox ESR 153 base, native build)": {"kind": "gecko", "bin": LOBSTER},
    "Firefox 159 (snap)": {"kind": "gecko", "bin": "/snap/bin/firefox"},
    "Brave 1.99 (snap)": {"kind": "chromium", "bin": "/snap/bin/brave"},
}
SITES = ["https://en.wikipedia.org/wiki/Lobster", "https://github.com/quietbytehq/LoboBrowser",
         "https://www.bbc.com/news", "https://www.reddit.com/r/linux/", "https://www.youtube.com/"]
RUNS = 5

hits = []
class Handler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        hits.append(time.monotonic())
        body = b"<!doctype html><title>ok</title><p>ok"
        self.send_response(200); self.send_header("Content-Type", "text/html")
        self.send_header("Content-Length", str(len(body))); self.end_headers(); self.wfile.write(body)
    def log_message(self, *a): pass

srv = socketserver.TCPServer(("127.0.0.1", 0), Handler)
PORT = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
URL = f"http://127.0.0.1:{PORT}/start"


def make_profile(spec):
    if "/snap/bin/" in spec["bin"]:
        snapname = os.path.basename(spec["bin"])
        base = f"{HOME}/snap/{snapname}/common/lobster-speedtest"
        os.makedirs(base, exist_ok=True)
        return tempfile.mkdtemp(dir=base)
    return tempfile.mkdtemp(prefix="lobster-speedtest-")

def cmd(spec, profile, urls):
    if spec["kind"] == "gecko":
        return [spec["bin"], "--headless", "--no-remote", "--profile", profile, *urls]
    return [spec["bin"], "--headless=new", f"--user-data-dir={profile}", "--no-first-run",
            "--no-default-browser-check", *urls]

def stop(p):
    try: os.killpg(p.pid, signal.SIGTERM)
    except ProcessLookupError: return
    try: p.wait(10)
    except subprocess.TimeoutExpired:
        os.killpg(p.pid, signal.SIGKILL); p.wait()
    time.sleep(2)

def startup(spec, profile):
    hits.clear()
    t0 = time.monotonic()
    p = subprocess.Popen(cmd(spec, profile, [URL]), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
    while not hits and time.monotonic() - t0 < 60: time.sleep(0.01)
    t = hits[0] - t0 if hits else None
    time.sleep(2); stop(p)
    return t

def all_procs():
    procs = {}
    for d in os.listdir("/proc"):
        if d.isdigit():
            try:
                ppid = int(open(f"/proc/{d}/stat").read().rsplit(")", 1)[1].split()[1])
                cmdline = open(f"/proc/{d}/cmdline", "rb").read().replace(b"\0", b" ").decode(errors="replace")
                procs[int(d)] = (ppid, cmdline)
            except Exception: pass
    return procs

def browser_pss_mb(launcher_pid, profile):
    # The browser's own processes: the launcher's tree plus any process that mentions
    # our temporary profile (snap launchers hand off to processes outside their tree),
    # and all of their descendants.
    procs = all_procs()
    children = {}
    for pid, (ppid, _) in procs.items(): children.setdefault(ppid, []).append(pid)
    roots = {launcher_pid} | {pid for pid, (_, cmd) in procs.items() if profile in cmd}
    pids, frontier = set(), list(roots)
    while frontier:
        x = frontier.pop()
        if x in pids: continue
        pids.add(x); frontier += children.get(x, [])
    total = 0
    for x in pids:
        try:
            for line in open(f"/proc/{x}/smaps_rollup"):
                if line.startswith("Pss:"): total += int(line.split()[1])
        except Exception: pass
    return total / 1024, len(pids)

def memory(spec):
    profile = make_profile(spec)
    p = subprocess.Popen(cmd(spec, profile, SITES), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
    time.sleep(25)
    mb, n = browser_pss_mb(p.pid, profile)
    stop(p)
    for pid, (_, c) in all_procs().items():   # make sure nothing of this run survives
        if profile in c:
            try: os.kill(pid, signal.SIGTERM)
            except Exception: pass
    time.sleep(2); shutil.rmtree(profile, ignore_errors=True)
    return mb, n

MEMORY_ONLY = "--memory-only" in sys.argv
OUT = [a for a in sys.argv[1:] if not a.startswith("--")][0]
results = json.load(open(OUT))["results"] if MEMORY_ONLY else {}
for name, spec in BROWSERS.items():
    if not os.path.exists(spec["bin"]):
        results[name] = {"error": f"not found: {spec['bin']}"}; continue
    print(f"== {name}", flush=True)
    if MEMORY_ONLY:
        mems = [memory(spec) for _ in range(3)]
        print(f"  memory: {mems}", flush=True)
        results[name]["memory_5_tabs_mb"] = round(statistics.median([m for m, _ in mems]))
        results[name]["processes"] = round(statistics.median([n for _, n in mems]))
        results[name]["raw"]["memory"] = mems
        continue
    first, repeat = [], []
    for i in range(RUNS):
        prof = make_profile(spec)
        first.append(startup(spec, prof))
        repeat.append(startup(spec, prof))
        shutil.rmtree(prof, ignore_errors=True)
        print(f"  run {i+1}: first {first[-1]}, repeat {repeat[-1]}", flush=True)
    mems = [memory(spec) for _ in range(3)]
    print(f"  memory: {mems}", flush=True)
    ok = lambda xs: [x for x in xs if x is not None]
    results[name] = {
        "first_launch_s": round(statistics.median(ok(first)), 2) if ok(first) else None,
        "repeat_launch_s": round(statistics.median(ok(repeat)), 2) if ok(repeat) else None,
        "memory_5_tabs_mb": round(statistics.median([m for m, _ in mems])),
        "processes": round(statistics.median([n for _, n in mems])),
        "raw": {"first": first, "repeat": repeat, "memory": mems},
    }

json.dump({"date": time.strftime("%Y-%m-%d %H:%M"), "runs": RUNS, "sites": SITES, "results": results},
          open(OUT, "w"), indent=2)
print(json.dumps(results, indent=2))
