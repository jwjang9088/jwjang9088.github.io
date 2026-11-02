'use strict';
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let content,dirty=false,selected=null;
const ordered=()=>[...content.projects].sort((a,b)=>a.order-b.order);
const notify=s=>$('#status').textContent=s;
function validate(d){
 if(!d||!d.profile||!Array.isArray(d.projects))throw Error('profile과 projects가 있는 JSON을 선택하세요.');
 const ids=new Set(),orders=new Set();
 for(const p of d.projects){if(!/^[a-z0-9][a-z0-9-]*$/.test(p.id)||ids.has(p.id))throw Error('작품 ID는 중복 없는 영문 소문자·숫자·하이픈이어야 합니다.');ids.add(p.id);if(orders.has(p.order))throw Error('노출 순서 숫자가 겹칩니다. 다른 숫자를 입력하세요.');orders.add(p.order);
 if(!p.title?.trim()||!p.category?.trim()||!Number.isFinite(p.order))throw Error('제목·분류·숫자 순서를 확인하세요.');
 if(!p.image)throw Error('대표 상세 이미지 경로를 입력하세요.');
 if(typeof p.description!=='string'||!Array.isArray(p.gallery)||typeof p.visible!=='boolean')throw Error('작품 설명·상세 이미지·표시 상태 형식이 올바르지 않습니다.');
 for(const url of [p.image,p.thumbnail,...p.gallery].filter(Boolean)){if(typeof url!=='string'||!(/^(images\/[a-zA-Z0-9_./-]+|https:\/\/[^\s]+)$/.test(url))||url.split('/').includes('..'))throw Error('이미지는 images/ 상대 경로 또는 HTTPS 주소를 사용하세요.');}
 if(p.beforeAfter&&p.gallery.length%2)throw Error('Before/After 상세 이미지는 짝수 장이어야 합니다.');
 if(p.link&&!/^https:\/\/[^\s]+$/.test(p.link))throw Error('프로젝트 링크는 HTTPS 주소여야 합니다.');
 }
 if(!/^#[a-f\d]{6}$/i.test(d.profile.background)||!d.profile.name?.trim())throw Error('소개 이름과 배경색을 확인하세요.');
 return d;
}
function changed(){dirty=true;notify('초안 수정됨 · JSON을 다운로드하고 저장소에 반영하세요.');}
function render(){const list=ordered();$('#count').textContent=`${list.length}개 · ${list.filter(p=>p.visible).length}개 공개`;
 $('#list').innerHTML=list.map(p=>`<div class="item" aria-current="${selected===p.id}"><img src="${esc(p.thumbnail||p.image)}" alt=""><button class="name" data-edit="${esc(p.id)}">${esc(p.title)}<small>${esc(p.category)} · 순서 ${p.order}${p.visible?'':' · 숨김'}</small></button><button class="move" data-move="${esc(p.id)}" data-step="-1" aria-label="${esc(p.title)} 위로">↑</button><button class="move" data-move="${esc(p.id)}" data-step="1" aria-label="${esc(p.title)} 아래로">↓</button></div>`).join('');
 $('[id=list]').querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>edit(b.dataset.edit));
 $('#list').querySelectorAll('[data-move]').forEach(b=>b.onclick=()=>{const all=ordered(),i=all.findIndex(p=>p.id===b.dataset.move),j=i+Number(b.dataset.step);if(j<0||j>=all.length)return;[all[i],all[j]]=[all[j],all[i]];all.forEach((p,k)=>p.order=(k+1)*10);changed();render();if(selected)edit(selected);});
}
function field(label,name,value,area=false,type='text'){return `<label class="field">${label}${area?`<textarea name="${name}">${esc(value)}</textarea>`:`<input type="${type}" name="${name}" value="${esc(value)}">`}</label>`;}
function edit(id){selected=id||null;const p=content.projects.find(p=>p.id===id)||{id:'',title:'',category:'Design',order:Math.max(0,...content.projects.map(p=>p.order))+10,description:'',year:'',image:'',thumbnail:'',gallery:[],visible:true};render();
 $('#editor').innerHTML=`<h2>${id?'작품 수정':'새 작품'}</h2><form id="form">${field('작품 ID · 이미지 폴더 이름과 맞추세요','id',p.id)}${field('제목','title',p.title)}<div class="pair">${field('카테고리','category',p.category)}${field('노출 순서 · 작은 숫자가 먼저','order',p.order,false,'number')}</div>${field('설명','description',p.description,true)}${field('연도','year',p.year)}${field('썸네일 경로 · 비우면 대표 이미지 사용','thumbnail',p.thumbnail)}${field('대표 상세 이미지 경로','image',p.image)}${field('나머지 상세 이미지 · 한 줄에 하나','gallery',p.gallery.join('\n'),true)}${field('외부 프로젝트 주소 · 선택','link',p.link)}<label class="field">표시 상태<select name="visible"><option value="true">공개</option><option value="false" ${p.visible===false?'selected':''}>숨김</option></select></label><label><input type="checkbox" name="beforeAfter" ${p.beforeAfter?'checked':''}> Before / After 비교 (상세 이미지는 쌍으로)</label><div class="actions"><button class="primary" type="submit">초안에 반영</button><button type="button" id="cancel">취소</button></div><p id="error" role="alert"></p></form>`;
 if(id)$('#form [name=id]').readOnly=true;
 $('#form').onsubmit=e=>{e.preventDefault();try{const values=Object.fromEntries(new FormData(e.target));const next=structuredClone(content);const work={...p,...values,order:Number(values.order),gallery:values.gallery.split('\n').map(s=>s.trim()).filter(Boolean),visible:values.visible==='true',beforeAfter:values.beforeAfter==='on'};if(id)next.projects[next.projects.findIndex(x=>x.id===id)]=work;else next.projects.push(work);validate(next);content=next;selected=work.id;changed();render();edit(work.id);}catch(err){$('#error').textContent=err.message;}};
 $('#cancel').onclick=()=>{selected=null;render();$('#editor').innerHTML='<p class="placeholder">작품을 선택해 주세요.</p>';};
}
$('#add').onclick=()=>{if(content)edit();};
$('#profile').onclick=()=>{if(!content)return;selected=null;render();const p=content.profile;$('#editor').innerHTML='<h2>소개 수정</h2><form id="form">'+['name','wordmark','role','bio','email','contactText','background','portrait'].map((key,i)=>field(['이름','로고 표기','직무','소개','이메일','연락 안내','배경색 (#RRGGBB)','프로필 이미지 경로'][i],key,p[key],['bio','contactText'].includes(key))).join('')+'<button class="primary">초안에 반영</button><p id="error" role="alert"></p></form>';$('#form').onsubmit=e=>{e.preventDefault();try{const next=structuredClone(content);Object.assign(next.profile,Object.fromEntries(new FormData(e.target)));validate(next);content=next;changed();}catch(err){$('#error').textContent=err.message;}};};
$('#download').onclick=()=>{try{validate(content);const a=document.createElement('a');const url=URL.createObjectURL(new Blob([JSON.stringify(content,null,2)+'\n'],{type:'application/json'}));a.href=url;a.download='content.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);dirty=false;notify('JSON을 다운로드했습니다. data/content.json을 교체하고 이미지와 함께 커밋하세요.');}catch(err){notify(err.message);}};
$('#import').onchange=async e=>{try{if(!e.target.files[0])return;const next=validate(JSON.parse(await e.target.files[0].text()));if(dirty&&!confirm('현재 탭의 미다운로드 초안을 가져온 JSON으로 바꿀까요?'))return;content=next;selected=null;dirty=true;render();$('#editor').innerHTML='<p class="placeholder">가져온 작품을 선택해 주세요.</p>';notify('JSON을 가져왔습니다. 공개 사이트에는 아직 반영되지 않았습니다.');}catch(err){notify(err.message);}finally{e.target.value='';}};
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
fetch('./data/content.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('데이터를 불러오지 못했습니다.');return r.json();}).then(d=>{content=validate(d);render();notify('저장소 데이터를 불러왔습니다.');}).catch(e=>notify(e.message+' HTTP 서버에서 열어 주세요.'));
