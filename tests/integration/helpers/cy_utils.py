import subprocess
import os
import glob


def run_headless(projectdir, testbasename, *args, **kwargs):
    cy_proj = projectdir
    testname = testbasename
    cy_bin = os.path.join(cy_proj, 'node_modules', '.bin', 'cypress')
    if os.name == 'nt':
        cy_bin += '.cmd'
    testfile = testname + ".spec.js"
    cy_testpath = os.path.join(cy_proj, "cypress", "integration", testfile)
    cy_command = f"{cy_bin} run --headless --project {cy_proj} --spec {cy_testpath}"
    if len(**kwargs) != 0:
        for arg, val in kwargs:
            cy_command +=  f" --{arg} {val}"
    return subprocess.call(cy_command)


# implementation based on cypress-failed-log
# TODO std{out,err} based cli reports improved for performance
def error_count(projectdir, testbasename):
    globpath = os.path.join(projectdir, "cypress", "logs", f"failed-{testbasename}*")
    return len(glob.glob(globpath))