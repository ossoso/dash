import subprocess
import os
import re
import glob

def run_headless(projectdir, testname, *args, **kwargs):
    cy_bin = os.path.join(projectdir, 'node_modules', '.bin', 'cypress')
    if os.name == 'nt':
        cy_bin += '.cmd'
    testfile = testname + ".spec.js"
    cy_testpath = os.path.join(projectdir, "cypress", "integration", testfile)
    cy_command = (
        f"{cy_bin} run --headless --project {projectdir} --spec {cy_testpath}"
    )
    if len(kwargs) != 0:
        for opt in kwargs.keys():
            if opt not in {'env'}:
                print(f'\"{opt}\" not handled')
            elif opt == 'env':
                cy_command += f" --{opt}"
                for name, val in kwargs[opt].items():
                    cy_command += f"{name}={val},"
                cy_command = cy_command[0:-1]
    return subprocess.run(cy_command.split(), capture_output=True)


class CypressTestRun:
    """Running and interacting with cypress test specs"""
    def __init__(self, projectdir, testname, *args, **kwargs):
        self.process_results = run_headless(
            self, projectdir, testname, *args, **kwargs
        )
        self.stdout = self.process_results.stdout

    def total_failing(self):
        re.findall('\s+.*Failing:\s+(\d+)', self.stdout)


# implementation based on cypress-failed-log
# TODO std{out,err} based cli reports improved for performance
def error_count(projectdir, testbasename):
    globpath = os.path.join(projectdir, "cypress", "logs", f"failed-{testbasename}*")
    return len(glob.glob(globpath))
