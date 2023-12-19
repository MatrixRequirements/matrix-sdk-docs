# Matrix Requirements SDK user documentation

## One time setup

To build, you need a recent version of python and pip.
One time only in this directory, set up a **python version environment**:

```
python -m venv venv
```

The `.gitignore` file for this project is already set up to ignore the `./venv` directory just created.

All installations will be made in this virtual environment.
Activate the environment with:

```
source ./venv/bin/activate
```

Then run:

```
pip install mkdocs-material
mkdocs serve
```

Mkdocs will run a server you can visit in a web browser.

## Environment

On subsequent sessions, run `source ./venv/bin/activate` to activate the virtual python environment.
Then `mkdocs serve` to get a preview of the site.