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
    if len(kwargs) != 0:
        for opt in kwargs.keys():
            if opt not in {'env'}:
                print(f'\"{opt}\" not handled')
            elif opt == 'env':
                cy_command += f" --{opt}"
                for name, val in kwargs[opt].items():
                    cy_command += f"{name}={val},"
                cy_command = cy_command[0:-1]

    return subprocess.run(cy_command)


# implementation based on cypress-failed-log
# TODO std{out,err} based cli reports improved for performance
def error_count(projectdir, testbasename):
    globpath = os.path.join(projectdir, "cypress", "logs", f"failed-{testbasename}*")
    return len(glob.glob(globpath))

# def parse_output()