"""Check content and local links before publishing. No third-party dependencies."""
from pathlib import Path
from urllib.parse import urlparse
import json,re,sys
ROOT=Path(__file__).resolve().parents[1]
def validate():
 d=json.loads((ROOT/'data/content.json').read_text());errors=[];ids=set();orders=set()
 def require(test,message):
  if not test:errors.append(message)
 def image(url,label,required=False):
  if not url:
   require(not required,f'{label}: 이미지 경로 필요');return
  if not isinstance(url,str):errors.append(f'{label}: 잘못된 경로');return
  if url.startswith('https://'):
   require(bool(urlparse(url).netloc),f'{label}: 잘못된 HTTPS 주소');return
  require(url.startswith('images/') and '..' not in url.split('/'),f'{label}: images/ 상대 경로 필요')
  path=(ROOT/url).resolve()
  require(path.is_relative_to(ROOT) and path.is_file(),f'{label}: 파일 없음 {url}')
 profile=d.get('profile',{})
 require(bool(profile.get('name','').strip()),'소개: 이름 필요')
 require(bool(re.fullmatch(r'#[0-9a-fA-F]{6}',profile.get('background',''))),'소개: 배경색 오류')
 image(profile.get('portrait'),'프로필')
 projects=d.get('projects');require(isinstance(projects,list),'projects 배열 필요')
 for p in projects or []:
  pid=p.get('id','');require(bool(re.fullmatch(r'[a-z0-9][a-z0-9-]*',pid)),f'{pid}: ID 형식 오류');require(pid not in ids,f'{pid}: 중복 ID');ids.add(pid)
  for key in ['title','category']:require(isinstance(p.get(key),str) and bool(p[key].strip()),f'{pid}: {key} 필요')
  require(isinstance(p.get('description'),str),f'{pid}: 설명 문자열 필요')
  require(type(p.get('visible')) is bool,f'{pid}: visible은 true/false')
  order=p.get('order');require(type(order) in [int,float],f'{pid}: 숫자 order 필요')
  require(order not in orders,f'{pid}: 중복 order {order}');orders.add(order)
  image(p.get('image'),pid+' 대표',True);image(p.get('thumbnail'),pid+' 썸네일')
  gallery=p.get('gallery');require(isinstance(gallery,list),f'{pid}: gallery 배열 필요')
  for url in gallery or []:image(url,pid+' 상세')
  if p.get('beforeAfter'):require(len(gallery or [])%2==0,f'{pid}: 비교 이미지 쌍 확인')
  if p.get('link'):require(p['link'].startswith('https://') and bool(urlparse(p['link']).netloc),f'{pid}: HTTPS 링크 필요')
 for path in [ROOT/'images',ROOT/'assets']:
  for f in path.rglob('*'):
   if f.is_file():require(f.stat().st_size<100*1024*1024,f'{f.name}: GitHub 단일 파일 제한 초과')
 size=sum(f.stat().st_size for folder in ['images','assets','data'] for f in (ROOT/folder).rglob('*') if f.is_file())
 require(size<1_000_000_000,'GitHub Pages 게시 용량 1GB 초과')
 for name in ['index.html','admin.html']:
  html=(ROOT/name).read_text()
  for url in re.findall(r'(?:src|href)="(\./[^"#]+)"',html):require((ROOT/url).is_file(),f'{name}: 누락 {url}')
 if errors:
  print('\n'.join(errors));sys.exit(1)
 print(f'PASS: {len(projects)} projects; local images and links valid; {size/1024/1024:.1f} MiB.')
 return d
if __name__=='__main__':validate()
