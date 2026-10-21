const $ = s => document.querySelector(s);
const KEY='jeongsu-phone-v1';
const fresh=()=>({advice:false,past:false,breakup:false,ack:false,hj:false,witness:false,sm:false,apology:false,reply:false,done:false,threads:{j:[],h:[],s:[]}});
let state;try{state={...fresh(),...JSON.parse(localStorage.getItem(KEY)||'null')};}catch{state=fresh();}
let page='home',draft=null,busy=false,notificationTarget='h';
const pending=new Set();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const names={j:'주연이 🤍',h:'형준',s:'승민'};
function toast(t){$('#toast').textContent=t;$('#toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').classList.remove('show'),3300);}
function notify(who,text){notificationTarget=who;$('#notification').innerHTML=`<small>지금</small><strong>카카오톡 · ${names[who]}</strong><p>${esc(text)}</p>`;$('#notification').hidden=false;}
function later(id,delay,fn){if(pending.has(id))return;pending.add(id);setTimeout(()=>{pending.delete(id);fn();save();render();resume();},delay);}
function resume(){
 if(state.breakup&&!state.ack)later('ack',2300,()=>{state.ack=true;add('j',false,'알겠어');notify('j','알겠어');});
 if(state.ack&&!state.hj)later('hj',6500,()=>{state.hj=true;add('h',false,'야 정수야\n너 주연이랑 헤어졌어?');notify('h','너 주연이랑 헤어졌어?');});
 if(state.apology&&!state.reply)later('reply',5500,()=>{state.reply=true;add('j',false,'승민이한테 들었어\n나한테 할 말 있어?');notify('j','나한테 할 말 있어?');});
}
function add(who,mine,text){state.threads[who].push({mine,text});}
function go(p){page=p;draft=null;$('#notification').hidden=true;if(p==='past'&&!state.past){state.past=true;save();toast('기억해 두었던 말이, 다시 보입니다.');}render();}
function head(title,right=''){return `<header class="app-head"><button class="back" data-go="${page==='chat-j'||page==='chat-h'||page==='chat-s'?'chats':'home'}" aria-label="뒤로">‹</button><h2>${title}</h2><small>${right}</small></header>`;}
function app(label,cls,icon,target,badge=''){return `<button class="app" data-go="${target}"><span class="icon ${cls}">${icon}${badge?`<b class="badge">${badge}</b>`:''}</span>${label}</button>`;}
function home(){return `<div class="wallpaper"><div class="date">11월 19일 수요일</div><div class="big-clock">21:07</div><div class="widget"><span class="label">A NOTE TO MYSELF</span><p>${state.done?'말하고 나서도,<br>들어야 할 말이 남아 있다.':state.ack?'붙잡아 주길 바랐던 말이<br>끝이 되어 돌아왔다.':'익숙해진 걸까.<br>마음이 달라진 걸까.'}</p><small>메모 · 어젯밤 01:24</small></div><div class="apps">${app('카카오톡','kakao','<span class="bubble-icon">TALK</span>','chats',state.hj&&!state.witness?'1':state.reply&&!state.done?'1':'')}${app('Safari','safari','◈','browser')}${app('메모','notes','≡','notes')}${app('사진','photos','✿','photos')}${app('전화','phoneicon','☎','calls')}${app('연락처','settings','♙','contacts')}</div><p class="home-hint">${state.done?'아직, 끝나지 않은 이야기':state.breakup?'알림이 오기 전, 남겨진 기록을 살펴보세요':'어떤 마음이었는지, 기록은 알고 있을까'}</p><button class="phone-reset" data-reset>↺ 처음부터</button><div class="dock">${app('전화','phoneicon','☎','calls')}${app('카카오톡','kakao','<span class="bubble-icon">TALK</span>','chats')}${app('Safari','safari','◈','browser')}</div></div>`;}
function row(who,sub){const last=state.threads[who].at(-1);return `<button class="chat-row" data-go="chat-${who}"><span class="avatar ${who}">${who==='j'?'연':who==='h'?'준':'민'}</span><span class="row-main"><strong>${names[who]}</strong><p>${esc(last?.text.replaceAll('\n',' ')||sub)}</p></span><time>${last?'지금':who==='j'?'20:48':''}</time></button>`;}
function chats(){return `<section class="app-page">${head('채팅','⌕')}<div class="scroll"><div class="section-label">CHATS</div>${row('j','형 오늘도 늦게 끝나?')}${row('h','낼 저녁 먹을래')}${state.witness?row('s','새로운 대화'):''}<p class="empty-hint">${!state.advice?'습관처럼 열어 본 대화방.\nSafari에는 닫지 않은 고민이 남아 있습니다.':!state.breakup?'주연이에게 보낼 수 있는 말이 생겼습니다.':''}</p></div></section>`;}
function message(m){return `<div class="msg ${m.mine?'mine':''}">${m.mine?'<time>오후 9:07</time>':''}<div class="text">${esc(m.text)}</div>${!m.mine?'<time>오후 9:07</time>':''}</div>`;}
const oldJ=[{mine:false,text:'형 오늘도 늦게 끝나?'},{mine:true,text:'응 좀 늦을 듯'},{mine:false,text:'그럼 끝나고 전화할까?'},{mine:true,text:'피곤해서 먼저 잘게'},{mine:false,text:'응 푹 쉬어 형'}];
function options(w){
 if(busy)return [];
 if(w==='j'){
  if(!state.breakup)return state.advice?[['break','주연아 우리 헤어지자'],['break','우리 좀 그만 만날까']]:[];
  if(state.reply&&!state.done)return state.past?[['finish','내가 불안한 걸 너한테 확인받으려고 했어. 네 마음을 시험한 거야. 미안해. 지금 답 안 해도 돼. 괜찮아지면 만나서 사과하고 싶어.']]:[['reflect','보낼 말을 고르기 전에, 예전 대화 다시 보기']];
  return [];
 }
 if(w==='h'){
  if(!state.hj)return [];
  if(!state.witness)return [['witness','왜? 무슨 일 있어?'],['witness','응. 근데 왜?']];
  if(!state.smContact)return [['contact','승민이랑 있어?'],['contact','어디서 봤는데? 주연이 괜찮아?']];
  return [];
 }
 if(w==='s'){
  if(!state.witness)return [];
  if(!state.sm)return [['sm-care','승민아 주연이 너랑 있어? 괜찮아?'],['sm-call','주연이 전화 좀 바꿔줄 수 있어?']];
  if(!state.apology)return state.past?[['apology','내가 너무 쉽게 생각했어. 지금 전화는 안 할게. 괜찮아지면 연락 왔다고만 전해 줘.']]:[['sm-worry','많이 울어?'],['reflect','주연이와의 예전 대화 다시 보기']];
 }
 return [];
}
function chat(w){const opts=options(w);let hint='';if(w==='j'&&!state.advice)hint='홈 화면의 Safari에서 정수가 남긴 검색 기록을 살펴보세요.';else if(w==='j'&&state.breakup&&!state.ack)hint='읽음 · 답장을 기다리는 중';else if(w==='j'&&state.ack&&!state.hj)hint='더는 답장이 오지 않습니다. 잠시 다른 기록을 둘러보세요.';else if(w==='s'&&!state.past&&state.sm)hint='주연이는 왜 알겠다고만 했을까. 예전 대화에 남은 말을 찾아보세요.';else if(w==='s'&&state.apology&&!state.reply)hint='승민이가 연락을 전해 주기로 했습니다.';else if(busy)hint='상대가 답장을 쓰고 있습니다…';return `<section class="app-page chat-page">${head(names[w],w==='j'?'<button class="back" data-go="past" style="font-size:11px">이전 기록</button>':'')}<div class="scroll" id="messages"><div class="chat-date">2025년 11월 19일 수요일</div>${w==='j'?oldJ.map(message).join(''):w==='h'?message({mine:false,text:'낼 저녁 먹을래'}):'<div class="chat-date">저장된 이전 대화가 없습니다.</div>'}${state.threads[w].length?`<div class="sender">${names[w]}</div>`:''}${state.threads[w].map(message).join('')}${hint?`<p class="empty-hint">${hint}</p>`:''}${state.done&&w==='j'?'<div class="ending"><small>CHAPTER 01 · END</small><h3>끝내는 말보다<br>어려운 시작.</h3><p>용서받은 건 아니다.<br>다만 이번에는, 기다리기로 했다.<br><br>첫 번째 이야기 체험이 끝났습니다.<br>홈으로 돌아가 남은 기록을 볼 수 있습니다.</p></div>':''}</div>${opts.length?`<div class="choices"><div class="choice-label"><span>보낼 말을 골라보세요</span><span>선택 후 전송</span></div>${opts.map(([action,text],i)=>`<button class="choice ${draft?.i===i?'selected':''}" data-choice="${i}" data-who="${w}">${esc(text)}</button>`).join('')}</div>`:''}<div class="composer"><div class="draft">${draft?esc(draft.text):opts.length?'보낼 말을 선택하세요':'메시지'}</div><button class="send" data-send="${w}" ${!draft?'disabled':''}>전송</button></div></section>`;}
function browser(){return `<section class="app-page">${head('Safari','탭 3개')}<div class="scroll"><div class="searchbar">⌕ 검색하거나 웹 사이트 이름 입력</div><div class="section-label">최근 검색 · 오늘</div><button class="history" data-go="article">권태기 극복하는 법<small>오후 8:51 · 지식iN 답변</small></button><button class="history" data-go="article">헤어지자고 하면 붙잡나요<small>오후 8:57 · 지식iN</small></button>${state.ack?'<button class="history" data-go="after-search">헤어지자고 했는데 안 붙잡는 이유<small>방금 · 검색 기록</small></button>':''}<button class="history" data-go="search-memory">남자친구랑 할 게 없을 때<small>어제 · 오후 11:42</small></button><p class="empty-hint">누군가에게 묻기는 어려워서,<br>검색창에 먼저 적었던 말들.</p></div></section>`;}
function article(){return `<section class="app-page">${head('지식iN','고민 상담')}<article class="scroll article"><span class="tag">연애 · 고민 있어요</span><h3>권태기인지 모르겠어요.<br>제 마음을 어떻게 확인하죠?</h3><p>오래 만났는데 예전처럼 설레지 않아요.<br>상대가 저를 좋아하는 건지도 잘 모르겠고요.<br>헤어지고 싶은 건 아닌데… 어떻게 해야 하죠?</p><div class="answer"><strong>✓ 채택된 답변</strong><p>한번 헤어지자고 해보세요.<br>진짜 좋아하면 붙잡겠죠.<br>그때 본인 마음도 알 수 있을 거예요.</p><div class="warning">익명 사용자의 답변입니다. 타인의 마음을 확인하는 정답이 될 수 없습니다.</div></div><p style="color:#8e977f;font-size:10px">답변을 읽은 뒤, 주연이에게 보낼 말이 떠올랐습니다.</p><button class="choice" data-advice>주연이 대화방 열기 ↗</button></article></section>`;}
function past(){return `<section class="app-page chat-page">${head('주연이 · 이전 기록','11월 12일')}<div class="scroll"><div class="chat-date">일주일 전, 수요일</div>${[{mine:false,text:'형 우리 토요일에는 볼 수 있어?'},{mine:true,text:'그때 봐서. 피곤할 수도 있어'},{mine:false,text:'알겠어'},{mine:false,text:'근데 형 나는\n괜찮다고 하면 진짜 다 괜찮은 줄 아는 게 가끔 서운해'},{mine:true,text:'왜 또 그래. 나 요즘 바쁜 거 알잖아'},{mine:false,text:'응 알지\n미안 그냥 보고 싶어서 그랬어'}].map(message).join('')}<p class="empty-hint">그때도, 알겠다고 했다.<br>그 말 뒤에 남은 마음은 묻지 않았다.</p><button class="choice" data-go="${state.sm?'chat-s':'chat-j'}">${state.sm?'승민이와의 대화로':'오늘의 대화로'} 돌아가기 →</button></div></section>`;}
function notes(){return `<section class="app-page">${head('메모','2개의 메모')}<div class="scroll"><div class="note-card"><h3>요즘</h3><p>같이 있으면 할 말이 없고
연락이 안 오면 폰을 자꾸 본다.

좋아하는 건 맞는 것 같은데.
주연이는 나 없어도 괜찮을까.</p><small>어젯밤 01:24</small></div><div class="note-card"><h3>주연이</h3><p>추운 거 싫어함
괜찮다고 해도 한 번 더 물어보기

토요일 저녁 약속. 이번엔 미루지 말기.</p><small>11월 8일 23:11</small></div></div></section>`;}
function photos(){return `<section class="app-page">${head('사진','보관함')}<div class="scroll"><div class="section-label">둘이 남긴 계절</div><div class="photo-grid"><button class="photo-tile" data-memory="그날은 커피가 다 식을 때까지 이야기했다.">09.14<br>나란히 놓인 커피 두 잔</button><button class="photo-tile" data-memory="주연이가 바다보다 형 사진이 더 많다고 웃었다.">08.23<br>여름 끝, 바다</button><button class="photo-tile" data-memory="찍지 말라면서도 초는 천천히 불었다.">10.04<br>작은 케이크</button><button class="photo-tile" data-memory="같은 우산을 쓰려고 일부러 돌아갔던 길.">10.28<br>비 오던 퇴근길</button></div><p class="photo-caption">사진 대신 기억의 설명을 넣은 체험판입니다.<br>기억을 누르면 그날의 짧은 문장이 나타납니다.</p></div></section>`;}
function contacts(){return `<section class="app-page">${head('연락처','나의 연락처')}<div class="scroll">${row('j','즐겨찾기')}${row('h','친구')}${state.witness?row('s','주연이 친구 · 저장된 연락처'):'<div class="note-card"><h3>승민</h3><p>주연이 친구<br>연락처만 저장되어 있습니다.</p><small>아직 연락할 계기가 없습니다.</small></div>'}</div></section>`;}
function calls(){return `<section class="app-page">${head('전화','최근 통화')}<div class="scroll"><div class="section-label">RECENTS</div><button class="chat-row" data-call><span class="avatar j">연</span><span class="row-main"><strong>주연이 🤍</strong><p>어제 · 발신 통화 · 2분</p></span><span>☎</span></button><button class="chat-row" data-go="chat-h"><span class="avatar">준</span><span class="row-main"><strong>형준</strong><p>월요일 · 수신 통화 · 12분</p></span></button><p class="empty-hint">${state.breakup?'지금 어떤 말을 하려고 전화를 거는 걸까.':'어제는 피곤하다는 말만 하고 끊었다.'}</p></div></section>`;}
function render(){const views={home,chats,browser,article,past,notes,photos,contacts,calls,'after-search':()=>`<section class="app-page">${head('검색 기록')}<div class="scroll article"><h3>헤어지자고 했는데<br>안 붙잡는 이유</h3><p>검색창에는 질문만 남아 있다.<br>정작 주연이에게는 아무것도 묻지 않았다.</p><button class="choice" data-go="past">예전 카톡을 다시 읽어보기 →</button></div></section>`,'search-memory':()=>`<section class="app-page">${head('검색 기록')}<div class="scroll article"><h3>남자친구랑 할 게 없을 때</h3><p>영화, 산책, 맛집.<br>검색 결과는 많았다.<br><br>주연이에게 뭘 하고 싶은지는 물어보지 않았다.</p><button class="choice" data-go="browser">검색 기록으로 돌아가기</button></div></section>`};$('#view').innerHTML=page.startsWith('chat-')?chat(page.slice(-1)):(views[page]||home)();$('#chapter').textContent=state.done?'다시 이야기할 수 있다면':state.apology?'기다리는 것도, 해야 할 일':state.witness?'알겠다는 말의 뒷면':state.breakup?'보내고 나서야 알게 된 것':'헤어지기 전, 어느 저녁';const box=$('#messages');if(box)box.scrollTop=box.scrollHeight;}
function send(w){if(!draft||busy)return;const {action,text}=draft;draft=null;if(action==='reflect'){go('past');return;}add(w,true,text);busy=true;save();render();const respond=()=>{
 if(action==='break'){state.breakup=true;}
 if(action==='witness'){state.witness=true;add('h',false,'나 방금 길에서 봤는데\n승민이한테 안겨서 엄청 울고 있어\n무슨 일 있었냐?');}
 if(action==='contact'){add('h',false,'응 주연이 친구 승민이 맞아\n일단 걔한테 연락해 봐. 나도 지나가다 본 거라 자세히는 몰라');state.smContact=true;}
 if(action==='sm-care'||action==='sm-call'){state.sm=true;add('s',false,action==='sm-care'?'네 형 저랑 있어요\n지금은 좀 진정시키고 있어요':'지금은 좀 어려울 것 같아요 형');add('s',false,'형이 헤어지자고 하셨다면서요');}
 if(action==='sm-worry'){add('s',false,'네. 조금 전까지는요\n알겠다고만 해서 괜찮은 줄 아셨던 거예요?');}
 if(action==='apology'){state.apology=true;add('s',false,'네 형\n좀 진정하면 연락 왔다고 전할게요\n그다음엔 주연이가 정하게 해 주세요');}
 if(action==='finish'){state.done=true;add('j',false,'나 형이 진짜 끝내고 싶은 줄 알았어');add('j',false,'지금은 얼굴 못 보겠어\n내일 얘기해');}
 busy=false;save();render();resume();};setTimeout(respond,action==='break'?500:1400);}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-reset')){$('#reset-dialog').showModal();return;}if(b.dataset.go){go(b.dataset.go);return;}if(b.hasAttribute('data-advice')){state.advice=true;save();go('chat-j');return;}if(b.dataset.choice!==undefined){const w=b.dataset.who,i=Number(b.dataset.choice),opt=options(w)[i];if(!opt)return;draft={i,action:opt[0],text:opt[1]};render();return;}if(b.dataset.send){send(b.dataset.send);return;}if(b.dataset.memory){toast(b.dataset.memory);return;}if(b.hasAttribute('data-call')){toast(state.breakup?'긴 신호음 끝에 연결되지 않았습니다. 지금은 카톡에 남겨진 말을 살펴보세요.':'통화 버튼 위에서 손이 멈췄다. 무슨 말을 해야 할지 모르겠다.');return;}});
$('#home').onclick=()=>go('home');$('#notification').onclick=()=>go('chat-'+notificationTarget);$('#reset').onclick=()=>$('#reset-dialog').showModal();$('#cancel-reset').onclick=()=>$('#reset-dialog').close();$('#confirm-reset').onclick=()=>{localStorage.removeItem(KEY);location.reload();};render();resume();
