"""Only public website files are included in the Pages artifact."""
from pathlib import Path
import shutil
from validate import validate,ROOT
validate()
dest=ROOT/'dist'
if dest.exists():shutil.rmtree(dest)
dest.mkdir()
for name in ['index.html','admin.html','.nojekyll']:
 shutil.copy2(ROOT/name,dest/name)
for name in ['assets','data','images']:shutil.copytree(ROOT/name,dest/name)
print('Pages artifact ready: dist/')
