"""Local preview and public Kick replay refresh. Run: python3 serve.py"""
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from functools import partial
from pathlib import Path
from html.parser import HTMLParser
from urllib.request import Request,urlopen
from urllib.parse import urljoin,urlparse
import argparse,json,re
class KickReplays(HTMLParser):
 def __init__(self):
  super().__init__();self.videos=[];self.current=None
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='a':
   url=urljoin('https://kick.com',a.get('href',''));p=urlparse(url)
   if p.hostname=='kick.com' and re.fullmatch(r'/pieroliero/videos/[\w-]+/?',p.path):
    self.current={'url':url,'title':a.get('title') or a.get('aria-label') or '','thumbnail':'' ,'words':[]}
  if self.current and tag=='img':
   image=a.get('src') or a.get('data-src','')
   if image.startswith('https://'):self.current['thumbnail']=image
   if not self.current['title']:self.current['title']=a.get('alt','')
 def handle_data(self,data):
  if self.current and data.strip():self.current['words'].append(data.strip())
 def handle_endtag(self,tag):
  if tag=='a' and self.current:
   item=self.current;self.current=None
   item['title']=item['title'] or ' '.join(item['words']) or 'PieroLiero live replay';item.pop('words')
   if not any(v['url']==item['url'] for v in self.videos):self.videos.append(item)
def kick_replays():
 try:
  req=Request('https://kick.com/pieroliero/videos',headers={'User-Agent':'Mozilla/5.0'})
  with urlopen(req,timeout=12) as response:html=response.read().decode('utf-8','replace')
  parser=KickReplays();parser.feed(html)
  # Only an explicit empty archive or real replay cards counts as a confirmed response.
  empty='There are no videos' in html or 'This channel has no videos currently' in html
  return {'status':'ok' if parser.videos or empty else 'unavailable','videos':parser.videos[:8],'channelUrl':'https://kick.com/pieroliero'}
 except Exception:return {'status':'unavailable','videos':[],'channelUrl':'https://kick.com/pieroliero'}
class Handler(SimpleHTTPRequestHandler):
 def do_GET(self):
  if self.path.split('?')[0]=='/api/kick-replays':
   data=json.dumps(kick_replays()).encode();self.send_response(200);self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(data)));self.send_header('Cache-Control','no-store');self.end_headers();self.wfile.write(data);return
  super().do_GET()
 def send_head(self):
  self.byte_range=None
  path=Path(self.translate_path(self.path));value=self.headers.get('Range','')
  if path.is_file() and re.fullmatch(r'bytes=\d+-\d*',value):
   size=path.stat().st_size;start,end=value[6:].split('-');start=int(start);end=min(int(end) if end else size-1,size-1)
   if start>=size or end<start:self.send_error(416);return None
   f=path.open('rb');f.seek(start);self.byte_range=(start,end)
   self.send_response(206);self.send_header('Content-type',self.guess_type(str(path)));self.send_header('Content-Length',str(end-start+1));self.send_header('Content-Range',f'bytes {start}-{end}/{size}');self.send_header('Accept-Ranges','bytes');self.end_headers();return f
  return super().send_head()
 def copyfile(self,source,outputfile):
  if not self.byte_range:return super().copyfile(source,outputfile)
  remaining=self.byte_range[1]-self.byte_range[0]+1
  while remaining:
   buf=source.read(min(65536,remaining))
   if not buf:break
   outputfile.write(buf);remaining-=len(buf)
if __name__=='__main__':
 args=argparse.ArgumentParser();args.add_argument('--port',type=int,default=8767);port=args.parse_args().port
 root=Path(__file__).resolve().parent
 print(f'Professor’s Office preview: http://127.0.0.1:{port}',flush=True)
 ThreadingHTTPServer(('127.0.0.1',port),partial(Handler,directory=str(root))).serve_forever()
