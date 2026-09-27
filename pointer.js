const stage=document.getElementById("stage"), pointer=document.getElementById("pointer"), pad=document.getElementById("trackpad"), toast=document.getElementById("toast"), frame=document.getElementById("frame"), url=document.getElementById("url");
let x=stage.clientWidth*.48,y=stage.clientHeight*.38, dragging=false, lastX=0,lastY=0,twoFinger=false;

function clamp(){x=Math.max(4,Math.min(stage.clientWidth-8,x));y=Math.max(4,Math.min(stage.clientHeight-8,y));pointer.style.left=x+"px";pointer.style.top=y+"px"}
function show(msg){toast.textContent=msg;toast.classList.add("show");clearTimeout(show.t);show.t=setTimeout(()=>toast.classList.remove("show"),850)}
function move(dx,dy){x+=dx*1.45;y+=dy*1.45;clamp()}
function localTarget(){return document.elementFromPoint(x+stage.getBoundingClientRect().left,y+stage.getBoundingClientRect().top)}
function clickAt(button=0){
  if(stage.classList.contains("external")){show(button===2?"Right click":"Left click");return}
  const el=localTarget(); if(!el)return;
  if(el.id==="testClick"){document.getElementById("result").textContent=button===2?"Right-click received.":"Left-click received ✓";show(button===2?"RIGHT CLICK":"LEFT CLICK")}
  else if(el.id==="testInput"){el.focus();show("INPUT FOCUSED")}
  else show(button===2?"RIGHT CLICK":"LEFT CLICK");
}
function reset(){x=stage.clientWidth*.48;y=stage.clientHeight*.38;clamp();show("Pointer reset")}
pad.addEventListener("touchstart",e=>{e.preventDefault();twoFinger=e.touches.length>1;lastX=e.touches[0].clientX;lastY=e.touches[0].clientY;dragging=true},{passive:false});
pad.addEventListener("touchmove",e=>{e.preventDefault();if(!dragging)return;const t=e.touches[0];move(t.clientX-lastX,t.clientY-lastY);lastX=t.clientX;lastY=t.clientY},{passive:false});
pad.addEventListener("touchend",e=>{e.preventDefault();if(e.touches.length===0){dragging=false;if(twoFinger){clickAt(2)}else{clickAt(0)}twoFinger=false}},{passive:false});
document.getElementById("left").onclick=()=>clickAt(0);
document.getElementById("right").onclick=()=>clickAt(2);
document.getElementById("reset").onclick=reset;
document.getElementById("testInput").addEventListener("focus",()=>show("Keyboard ready — type normally"));
document.getElementById("keyboard").onclick=()=>{document.getElementById("testInput").focus();show("Keyboard opened")};
document.getElementById("go").onclick=()=>{let v=url.value.trim();if(!/^https?:\\/\\//i.test(v))v="https://"+v;frame.src=v;stage.classList.add("external");show("Website loaded in preview")};
url.addEventListener("keydown",e=>{if(e.key==="Enter")document.getElementById("go").click()});
window.addEventListener("resize",clamp);
if("serviceWorker" in navigator)navigator.serviceWorker.register("pointer-sw.js").catch(()=>{});
clamp();
