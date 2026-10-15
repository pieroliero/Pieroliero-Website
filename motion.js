/* Individual object layers over a clean background; no moving background patches. */
(() => {
 const room=document.querySelector('.room'),base=room.querySelector('.room-art');
 const details=new Image();details.src='assets/office-details.webp';
 const canvas=document.createElement('canvas');canvas.className='desk-motion';canvas.setAttribute('aria-hidden','true');canvas.width=2048;canvas.height=1143;
 room.insertBefore(canvas,room.querySelector('.room-shade'));
 const ctx=canvas.getContext('2d'),W=2048,H=1143,reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let active=null,frame=0,start=0,ready=false;
 const peach=new Path2D('M 1845 792 C 1812 773 1766 778 1729 810 C 1693 838 1672 874 1681 921 C 1688 973 1719 1011 1769 1027 C 1818 1045 1878 1037 1913 1003 C 1940 978 1954 942 1949 904 C 1944 859 1923 826 1885 811 C 1919 814 1958 817 1989 837 C 1968 799 1934 775 1898 769 C 1867 764 1841 773 1821 799 L 1815 803 L 1811 789 L 1806 782 L 1799 784 L 1804 805 C 1818 799 1830 795 1845 792 Z');
 const book=new Path2D('M 1048 914 L 1242 785 L 1310 768 L 1305 778 L 1297 785 L 1328 806 L 1336 806 L 1330 815 L 1228 875 L 1212 893 L 1182 910 L 1156 918 L 1133 934 L 1112 929 L 1097 923 L 1082 930 Z');
 const needle=new Path2D('M 1025 940 L 1033 928 L 1060 932 L 1155 898 L 1167 887 L 1197 887 L 1216 900 L 1212 932 L 1196 945 L 1168 942 L 1158 926 L 1065 953 L 1058 964 L 1027 963 Z');
 const lampShade=new Path2D('M 135 625 C 136 600 135 578 140 561 C 148 535 169 517 193 509 C 211 503 233 504 259 504 C 296 503 332 505 355 513 C 385 523 407 549 423 576 C 434 590 444 599 451 605 C 413 614 373 621 328 625 C 269 632 198 632 139 629 Z');
 const globe={cx:520,cy:799,rx:80,ry:87};
 const vinyl={cx:953,cy:944,rx:190,ry:25};
 let globeAlbedo,globeLight,globeFrame,globeCanvas,recordTexture;
 function drawSource(image){ctx.drawImage(image,0,0,W,H);}
 function objectLayer(path,pivot,angle=0,dy=0){ctx.save();ctx.translate(pivot[0],pivot[1]+dy);ctx.rotate(angle);ctx.translate(-pivot[0],-pivot[1]);ctx.clip(path);drawSource(details);ctx.restore();}
 function shadePeach(){ctx.save();ctx.translate(1817,1034);ctx.scale(1,.15);const glow=ctx.createRadialGradient(0,0,5,0,0,125);glow.addColorStop(0,'rgba(55,29,18,.32)');glow.addColorStop(1,'rgba(55,29,18,0)');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(0,0,125,0,Math.PI*2);ctx.fill();ctx.restore();}
 function drawStatic(seconds=0){
  ctx.clearRect(0,0,W,H);if(!ready)return;
  // The book raises at its far edge, then settles with a small rebound.
  const cycle=seconds%2.1;
  let lift=0;
  if(active==='book'){
   if(cycle<.65)lift=Math.sin(cycle/.65*Math.PI/2)*.065;
   else if(cycle<1.15)lift=Math.cos((cycle-.65)/.5*Math.PI/2)*.065;
   else if(cycle<1.45)lift=Math.sin((cycle-1.15)/.3*Math.PI)*-.008;
  }
  objectLayer(book,[1085,924],-lift);
  // Keep the record player's arm in front of the moving book.
  ctx.save();ctx.clip(needle);drawSource(base);ctx.restore();
  shadePeach();objectLayer(peach,[1818,1031],active==='peach'?Math.sin(seconds*9)*.035:0,active==='peach'?-Math.abs(Math.sin(seconds*9))*2:0);
 }
 function prepare(){
  if(!base.complete||!base.naturalWidth||!details.complete||!details.naturalWidth)return;
  const n=180,c=document.createElement('canvas');c.width=n;c.height=n;const g=c.getContext('2d');
  const crop=[(globe.cx-globe.rx)/W*base.naturalWidth,(globe.cy-globe.ry)/H*base.naturalHeight,globe.rx*2/W*base.naturalWidth,globe.ry*2/H*base.naturalHeight];
  g.drawImage(base,...crop,0,0,n,n);const pixels=g.getImageData(0,0,n,n).data;
  const blurred=document.createElement('canvas');blurred.width=n;blurred.height=n;const bg=blurred.getContext('2d');bg.filter='blur(18px)';bg.drawImage(c,0,0);const light=bg.getImageData(0,0,n,n).data;
  globeAlbedo=new Float32Array(n*n*3);globeLight=new Float32Array(n*n*3);
  for(let p=0;p<n*n;p++){
   const l=Math.max(50,.2126*light[p*4]+.7152*light[p*4+1]+.0722*light[p*4+2]);const texture=(.2126*pixels[p*4]+.7152*pixels[p*4+1]+.0722*pixels[p*4+2])/l;
   // Move neutral map detail beneath a fixed RGB color and lighting field.
   for(let k=0;k<3;k++){globeAlbedo[p*3+k]=Math.max(.65,Math.min(1.45,texture));globeLight[p*3+k]=light[p*4+k];}
  }
  globeCanvas=document.createElement('canvas');globeCanvas.width=n;globeCanvas.height=n;globeFrame=globeCanvas.getContext('2d').createImageData(n,n);
  recordTexture=document.createElement('canvas');recordTexture.width=420;recordTexture.height=420;
  recordTexture.getContext('2d').drawImage(base,(vinyl.cx-vinyl.rx)/W*base.naturalWidth,(vinyl.cy-vinyl.ry)/H*base.naturalHeight,vinyl.rx*2/W*base.naturalWidth,vinyl.ry*2/H*base.naturalHeight,0,0,420,420);
  ready=true;drawStatic();
 }
 function spinGlobe(seconds){
  const n=180,offset=seconds*.14;
  for(let y=0;y<n;y++){
   const yn=(y+.5)/n*2-1,half=Math.sqrt(Math.max(0,1-yn*yn))*n/2,left=Math.ceil(n/2-half),right=Math.floor(n/2+half),width=right-left+1;
   for(let x=left;x<=right;x++){
    const from=left+((x-left+Math.floor(offset*width))%width),dest=y*n+x,src=y*n+from;
    for(let k=0;k<3;k++)globeFrame.data[dest*4+k]=Math.min(255,globeAlbedo[src*3+k]*globeLight[dest*3+k]);
    globeFrame.data[dest*4+3]=255;
   }
  }
  globeCanvas.getContext('2d').putImageData(globeFrame,0,0);
  ctx.save();ctx.beginPath();ctx.ellipse(globe.cx,globe.cy,globe.rx,globe.ry,0,0,Math.PI*2);ctx.clip();ctx.drawImage(globeCanvas,globe.cx-globe.rx,globe.cy-globe.ry,globe.rx*2,globe.ry*2);ctx.restore();
 }
 function animate(now){
  if(!active||!ready||reduced.matches)return;
  const seconds=(now-start)/1000;drawStatic(seconds);
  if(active==='globe')spinGlobe(seconds);
  if(active==='vinyl'){
   ctx.save();ctx.translate(vinyl.cx,vinyl.cy);ctx.scale(vinyl.rx/210,vinyl.ry/210);ctx.beginPath();ctx.arc(0,0,204,0,Math.PI*2);ctx.clip();ctx.rotate(seconds*1.8);ctx.drawImage(recordTexture,-210,-210);ctx.restore();
   ctx.save();ctx.clip(needle);drawSource(base);ctx.restore();
  }
  if(active==='lamp'){
   const cycle=seconds%3.6,b=cycle<.15?.83:cycle<.3?1.03:cycle<.45?.75:cycle<.6?1.04:1;
   ctx.save();ctx.clip(lampShade);ctx.filter=`brightness(${b})`;drawSource(base);ctx.restore();
  }
  frame=requestAnimationFrame(animate);
 }
 function stop(){cancelAnimationFrame(frame);active=null;canvas.dataset.active='';drawStatic();}
 function play(key){if(!ready||reduced.matches)return;stop();active=key;canvas.dataset.active=key;start=performance.now();frame=requestAnimationFrame(animate);}
 for(const [selector,key] of Object.entries({lamp:'lamp',globe:'globe',peach:'peach',books:'book',vinyl:'vinyl'})){
  const button=room.querySelector('.'+selector);button.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')play(key)});button.addEventListener('pointerleave',stop);button.addEventListener('focus',()=>play(key));button.addEventListener('blur',stop);button.addEventListener('click',stop);
 }
 reduced.addEventListener('change',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});base.addEventListener('load',prepare);details.addEventListener('load',prepare);prepare();
})();
