export type Face={icon:string;label:string};
export type SafetyPair={a:Face;b:Face;why:string;kind:'识别'|'控制'|'应急'|'复核'};
export type EventType='shift'|'fog'|'pressure'|'lock';
export type Scene={name:string;site:string;category:'工程施工'|'生产运营';icon:string;color:string;mechanic:string;eventName:string;eventType:EventType;knowledge:string;pairs:SafetyPair[]};
export type Tile={id:number;pairKey:number;pairIndex:number;face:'a'|'b';row:number;col:number;removed:boolean;lockedUntil:number};
export type LinkPoint={row:number;col:number};
export type MatchState={scene:number;stage:number;difficulty:number;hero:number;rows:number;cols:number;tiles:Tile[];selected:number|null;hint:number[];hintUntil:number;time:number;timeLimit:number;freezeUntil:number;score:number;combo:number;bestCombo:number;matches:number;totalPairs:number;mistakes:number;status:'playing'|'won'|'lost';skillCharges:number;shuffleCharges:number;notice:string;noticeUntil:number;fogUntil:number;lastPath:LinkPoint[];lastPathUntil:number;seed:number};

const p=(ai:string,al:string,bi:string,bl:string,why:string,kind:SafetyPair['kind']='控制'):SafetyPair=>({a:{icon:ai,label:al},b:{icon:bi,label:bl},why,kind});

export const HEROES=[
 {name:'安禾',animal:'马',role:'均衡·守护',skill:'安全集结',desc:'重排剩余牌并恢复少量时间',color:'#61e0a5'},
 {name:'永勋',animal:'猫头鹰',role:'研判·洞察',skill:'洞察之眼',desc:'标出有效配对并说明关联',color:'#f5c86b'},
 {name:'凌曜',animal:'雪豹',role:'敏捷·响应',skill:'迅捷转移',desc:'立即消除一组可连接牌',color:'#70c8ff'},
 {name:'观微',animal:'边牧',role:'巡检·追踪',skill:'循迹排查',desc:'揭开干扰并暂停倒计时',color:'#ff8f7c'},
];

export const STAGES=[
 {name:'隐患初识',brief:'相同主题与直观措施配对',pairs:12},
 {name:'交叉作业',brief:'牌面增多，现场干扰开始介入',pairs:15},
 {name:'系统受控',brief:'完成完整安全链，解除首领风险',pairs:18},
];

export const SCENES:Scene[]=[
 {name:'高层建筑施工',site:'主体结构与脚手架作业面',category:'工程施工',icon:'🏗️',color:'#f0a84f',mechanic:'塔吊回转会周期重排牌阵',eventName:'吊运路线变化',eventType:'shift',knowledge:'高处、临边和吊运风险必须通过工程防护、作业条件确认与区域管控共同控制。',pairs:[
  p('🕳️','临边缺口','🛡️','可靠防护','临边作业应设置符合方案要求的防护设施。'),p('🪜','登高通道','✅','验收可用','登高设施需检查验收并保持通行条件。','复核'),p('🪝','吊物经过','🚧','区域隔离','吊运影响区域应警戒隔离，人员不得在吊物下停留。'),p('🧱','零散材料','📦','稳固收纳','高处材料和工具应采取防坠落措施。'),p('🧰','脚手架','📋','验收挂牌','脚手架应按方案搭设并经验收后使用。','复核'),p('🌬️','大风预警','⏸️','停止作业','条件不满足时应停止相关高风险作业。','应急'),p('👷','安全带','🔗','可靠挂设','个人防护不能替代工程防护，且应正确使用。'),p('🔍','防护拆改','📣','审批恢复','防护设施不得擅自拆除，确需拆改应履行程序并及时恢复。','复核')]},
 {name:'市政管网施工',site:'道路开挖与地下管线',category:'工程施工',icon:'🚧',color:'#d8b063',mechanic:'来水与交通压力会压缩作业时间',eventName:'地下水位上升',eventType:'pressure',knowledge:'开挖前应查明地下条件，作业中持续关注支护、积水、周边荷载和人员进出。',pairs:[
  p('🗺️','管线资料','📡','探查确认','资料查询与现场探查应共同用于确认地下管线。','识别'),p('🕳️','沟槽开挖','🧱','按案支护','沟槽支护与放坡应执行经审批的专项方案。'),p('🚗','临近车流','🚦','交通导改','道路施工应设置交通组织和隔离措施。'),p('💧','沟内积水','⏸️','撤离处置','异常涌水时应停止作业并撤出人员。','应急'),p('🪜','人员上下','🛤️','安全通道','沟槽应设置可靠的上下通道。'),p('🏋️','坑边堆载','↔️','控制距离','坑边荷载应符合方案要求。'),p('🌫️','井内作业','📟','检测监护','进入有限空间前应完成辨识、许可、检测和监护。'),p('📏','支护变形','🚨','监测预警','发现异常变形应及时停止作业并按预案处置。','应急')]},
 {name:'工业安装施工',site:'设备吊装、焊接与管廊安装',category:'工程施工',icon:'🏭',color:'#ff806d',mechanic:'交叉作业会暂时遮蔽文字线索',eventName:'焊烟遮挡视线',eventType:'fog',knowledge:'吊装、动火和高处安装并存时，应统一协调作业顺序、隔离范围和许可条件。',pairs:[
  p('🏗️','大型吊装','📐','专项方案','大型设备吊装应按审批方案组织实施。'),p('🪝','吊索具','🔍','检查确认','吊索具和连接点使用前应检查确认。','复核'),p('🔥','动火作业','📄','许可隔离','动火前应完成许可、隔离、清理和监护等条件。'),p('🧯','初期火情','📣','报警处置','处置应以人员安全和现场预案为前提。','应急'),p('⚙️','设备就位','🧱','防倾稳固','临时固定和最终连接应满足方案要求。'),p('🔌','焊机电缆','🛡️','完好防护','用电设备及线路应保持完好并采取相应防护。'),p('👥','上下交叉','🧭','错时隔离','交叉作业应协调错时或设置可靠隔离。'),p('🧪','可燃介质','📟','检测确认','动火环境及关联设备应按要求检测确认。','识别')]},
 {name:'停工检维修',site:'装置停车与设备检修',category:'工程施工',icon:'🛠️',color:'#7ac5d8',mechanic:'残余能量会锁定部分牌面',eventName:'残余能量回弹',eventType:'lock',knowledge:'检维修的核心不是“设备停了”，而是完成能量辨识、隔离、验证和恢复前确认。',pairs:[
  p('⚙️','设备停转','🔒','能量隔离','停止运转不等于能量已隔离。'),p('⚡','电气能源','🏷️','上锁挂牌','能量隔离应按程序实施并保持受控。'),p('💨','残余压力','📉','泄放验证','残余压力应按方案释放并确认。','复核'),p('🔧','拆开设备','🧱','盲板隔离','工艺隔离方式应由专业人员按方案确定。'),p('👥','多人检修','🧾','锁具管理','多人作业应明确个人控制和交接规则。'),p('▶️','准备试车','📣','清点确认','恢复前应确认人员、工具和防护设施状态。','复核'),p('🔄','临时变更','📝','变更管理','临时措施和偏离应履行变更程序。'),p('🚨','隔离失效','⏸️','停止撤离','发现隔离异常应立即停止作业并报告。','应急')]},
 {name:'临时用电施工',site:'配电系统与移动用电设备',category:'工程施工',icon:'⚡',color:'#e9cc55',mechanic:'电弧警报会快速增加压力',eventName:'漏电保护报警',eventType:'pressure',knowledge:'临时用电应由具备相应资格的人员按方案实施，游戏中的配对不替代现场电气操作。',pairs:[
  p('📦','临时配电箱','🌧️','防护完好','配电设施应具有与环境相适应的防护。'),p('🔌','移动电缆','🌉','架空防护','线路敷设应避免机械损伤、积水和车辆碾压。'),p('⚡','漏电异常','⏸️','停用检查','保护装置动作或异常时不得强行恢复使用。','应急'),p('👷','电气操作','🎓','持证人员','相关作业应由具备相应资格的人员实施。'),p('🧰','手持工具','🔍','使用前检查','移动电气设备使用前应检查完好状态。','复核'),p('💦','潮湿环境','🛡️','专项防护','潮湿等特殊环境应采取匹配的电气防护。'),p('🔄','多级保护','🧪','定期试验','保护装置应按要求检查和试验。','复核'),p('🚧','带电区域','🔒','隔离警示','危险区域应隔离并设置清晰警示。')]},
 {name:'道路桥梁施工',site:'架梁、摊铺与临水作业',category:'工程施工',icon:'🌉',color:'#6eb5dd',mechanic:'施工车辆会推动整行牌位',eventName:'运梁车通过',eventType:'shift',knowledge:'道路桥梁施工应统筹大型设备、交通组织、临边临水和天气条件。',pairs:[
  p('🚚','施工车辆','🧭','人车分流','车辆路线和人员通道应有效分离。'),p('🌉','架梁作业','🚧','封控区域','架设影响范围应实施封控。'),p('🌊','临水作业','🛟','救生保障','临水作业应配置匹配的防护和救援条件。'),p('🌧️','恶劣天气','⏸️','停工评估','天气条件超过控制要求时应停止相关作业。','应急'),p('🏗️','起重设备','📋','检查确认','设备状态与作业条件应在作业前确认。','复核'),p('🚦','交通转换','📣','引导警示','交通转换区域应设置连续清晰的引导。'),p('🕳️','桥面孔洞','🛡️','盖板防护','孔洞应采取可靠防护并保持有效。'),p('📏','结构位移','🚨','监测响应','监测异常应按预警机制及时响应。','应急')]},
 {name:'拆除改造施工',site:'既有建筑拆除与内部改造',category:'工程施工',icon:'🏚️',color:'#ba9b84',mechanic:'扬尘会遮蔽短时线索',eventName:'扬尘扩散',eventType:'fog',knowledge:'拆除必须建立在结构调查和专项方案基础上，严禁用游戏提示替代专业判断。',pairs:[
  p('🏚️','既有结构','🔍','事前调查','拆除前应查明结构、管线和周边条件。','识别'),p('📐','拆除顺序','📋','专项方案','拆除顺序和方法应执行审批方案。'),p('⚡','原有能源','🔒','切断隔离','施工前应确认相关能源和介质已受控。'),p('🧱','局部拆改','🛡️','临时支撑','影响结构稳定的作业应按方案设置支撑。'),p('🌫️','粉尘产生','💨','源头控制','粉尘应优先采取工程控制和暴露管理。'),p('⬇️','高处废料','🛤️','专用通道','废料应通过规定方式清运，禁止随意抛掷。'),p('👥','无关人员','🚧','区域封闭','拆除影响区域应封闭管理。'),p('⚠️','异常声响','⏸️','立即撤离','发现失稳征兆应立即停止并撤离。','应急')]},
 {name:'深基坑施工',site:'基坑支护、降水与土方作业',category:'工程施工',icon:'🕳️',color:'#8cb36b',mechanic:'边坡压力会缩短有效处置时间',eventName:'监测数据突变',eventType:'pressure',knowledge:'深基坑风险控制依赖设计、施工、监测和应急响应的连续闭环。',pairs:[
  p('📐','支护设计','📋','按案施工','支护体系应按经审批的设计和方案实施。'),p('📊','监测数据','🔔','预警响应','监测结果应及时分析并触发相应响应。'),p('💧','地下来水','🧭','降排水方案','降排水应结合地质和周边环境按方案实施。'),p('🏗️','坑边设备','↔️','荷载控制','坑边设备和堆载应符合设计控制要求。'),p('🪜','上下基坑','🛤️','专用通道','人员进出应使用安全通道。'),p('🌧️','强降雨','⏸️','停工撤离','极端天气和异常积水时应及时停工撤离。','应急'),p('🏢','周边建筑','📍','同步监测','应关注施工对周边建构筑物和管线的影响。','识别'),p('🧱','支撑拆换','✅','条件确认','支撑拆换应按方案并确认结构条件。','复核')]},
 {name:'水处理设施',site:'加药间、池体与泵房',category:'生产运营',icon:'💧',color:'#48c9cf',mechanic:'泄漏扩散会增加现场压力',eventName:'液体接近排水口',eventType:'pressure',knowledge:'发现异常后应先识别介质与影响范围，再组织撤离、源头控制和环境保护。',pairs:[
  p('💧','异常液体','📟','识别确认','不能仅凭颜色或气味判断介质。','识别'),p('🧪','加药设备','⏹️','安全停用','设备控制应由授权人员按程序实施。'),p('🕳️','雨水排口','🚧','适配围控','围控方式和材料应与介质及现场条件匹配。'),p('👥','现场人员','➡️','安全撤离','人员保护优先于抢险处置。','应急'),p('🛢️','储罐异常','🔍','完整性检查','应关注材质、年限、状态和维护记录。'),p('🌫️','井室作业','📋','许可检测','有限空间进入应严格执行审批和检测监护。'),p('🌊','池边缺口','🛡️','临边防护','池体临边防护应保持完整有效。'),p('✅','泄漏受控','📝','复核报告','受控后仍需确认设备状态并报告。','复核')]},
 {name:'仓储物流园',site:'货架、装卸口与充电区',category:'生产运营',icon:'📦',color:'#eea458',mechanic:'物流车流会推动牌阵变化',eventName:'叉车穿行',eventType:'shift',knowledge:'仓储安全依赖人车分流、货架完整性、堆码稳定和充电区域管理。',pairs:[
  p('🚜','叉车盲区','🚶','人车分流','人员通道与车辆路线应有效分离。'),p('📦','货物超高','📏','限高堆码','堆码应符合稳定性和限高要求。'),p('🧱','货架变形','⏸️','停用检查','发现货架损伤应隔离并专业评估。','应急'),p('🔋','电池充电','🌬️','专用区域','充电应在符合要求的区域进行。'),p('🚪','消防通道','✅','保持畅通','疏散和消防通道不得占用。','复核'),p('⬇️','高位坠物','🛡️','防坠措施','货物和货架应采取稳定及防坠措施。'),p('🚚','装卸车辆','🛑','止动确认','车辆装卸状态应按规程可靠控制。'),p('🔥','异常起火','📣','报警撤离','火情失控或条件不明时应及时报警撤离。','应急')]},
 {name:'化学品储运',site:'储罐、卸车区与管廊',category:'生产运营',icon:'🧪',color:'#a78bfa',mechanic:'气云会暂时遮蔽牌面文字',eventName:'检测报警',eventType:'fog',knowledge:'化学品处置必须以物料信息、检测结果、授权程序和应急预案为依据。',pairs:[
  p('🏷️','物料标签','📄','信息核对','作业前应核对介质及其危险信息。','识别'),p('🚛','槽车卸料','🔗','连接确认','装卸连接和防拉脱措施应检查确认。','复核'),p('💨','气体报警','⏸️','停止撤离','报警时应停止作业并按预案响应。','应急'),p('🔥','点火来源','🚫','严格控制','可燃环境应控制点火源。'),p('🛢️','管线泄漏','⏹️','授权隔离','源头隔离应由授权人员按程序实施。'),p('🕳️','排水系统','🚧','防止扩散','应防止危险物料进入敏感环境受体。'),p('🧤','个体防护','📋','介质匹配','防护用品应根据风险评估和物料特性选择。'),p('✅','处置结束','🔍','检测复核','恢复前应确认环境和设备状态。','复核')]},
 {name:'地下矿山',site:'巷道、运输与通风系统',category:'生产运营',icon:'⛏️',color:'#7da0b8',mechanic:'有限照明会周期隐藏文字',eventName:'通风波动',eventType:'fog',knowledge:'地下空间中气体、通风、水害和顶板异常可能不直观，检测与撤离路线始终关键。',pairs:[
  p('🌫️','空气异常','📟','仪器检测','缺氧和有毒气体不能依靠感官判断。','识别'),p('💨','通风异常','⏸️','撤出人员','通风条件异常时应按规定撤离。','应急'),p('🪨','顶板异响','🚨','预警撤离','发现失稳征兆应立即报告并撤离。','应急'),p('💧','异常涌水','🧭','按线撤离','水害征兆出现时应沿安全路线撤离。','应急'),p('🚋','巷道运输','🚦','行车隔离','运输线路应执行行人与车辆管控。'),p('🚪','安全出口','✅','保持可用','出口和撤离路线应保持畅通。','复核'),p('👥','人员受困','📣','专业救援','不得在条件不明时盲目施救。'),p('📡','通信中断','🔧','恢复保障','通信和定位保障应保持有效。','复核')]},
];

function rng(state:{seed:number}){state.seed=(state.seed*1664525+1013904223)>>>0;return state.seed/4294967296;}
function shuffle<T>(arr:T[],state:{seed:number}){for(let i=arr.length-1;i>0;i--){const j=Math.floor(rng(state)*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr;}

export function createMatch(scene=0,stage=0,difficulty=0,hero=0,seed=Date.now()>>>0):MatchState{
 const rows=6,cols=6,totalPairs=STAGES[stage].pairs;
 const s:MatchState={scene,stage,difficulty,hero,rows,cols,tiles:[],selected:null,hint:[],hintUntil:0,time:0,timeLimit:[150,125,105][difficulty]+[20,10,0][stage],freezeUntil:0,score:0,combo:0,bestCombo:0,matches:0,totalPairs,mistakes:0,status:'playing',skillCharges:hero===1?3:2,shuffleCharges:2,notice:'连接不超过两个转弯的关联牌',noticeUntil:4,fogUntil:0,lastPath:[],lastPathUntil:0,seed};
 const pairDefs=SCENES[scene].pairs;const tiles:Tile[]=[];
 for(let i=0;i<totalPairs;i++){const pi=i%pairDefs.length;tiles.push({id:i*2,pairKey:i,pairIndex:pi,face:'a',row:0,col:0,removed:false,lockedUntil:0},{id:i*2+1,pairKey:i,pairIndex:pi,face:'b',row:0,col:0,removed:false,lockedUntil:0});}
 shuffle(tiles,s);const empties=rows*cols-tiles.length;const positions=Array.from({length:rows*cols},(_,i)=>i);
 // Create recognizably different silhouettes while retaining an even tile count.
 if(empties>0){const pattern=scene%4;positions.sort((a,b)=>positionRank(a,pattern,rows,cols)-positionRank(b,pattern,rows,cols));positions.splice(0,empties);}
 shuffle(positions,s);tiles.forEach((t,i)=>{t.row=Math.floor(positions[i]/cols);t.col=positions[i]%cols;});s.tiles=tiles;
 ensureMove(s);return s;
}

function positionRank(i:number,pattern:number,rows:number,cols:number){const r=Math.floor(i/cols),c=i%cols;if(pattern===0)return Math.abs(r-2.5)+Math.abs(c-2.5);if(pattern===1)return Math.min(r,rows-1-r,c,cols-1-c);if(pattern===2)return Math.abs(r-c);return Math.abs(r+c-(rows-1));}
function tileAt(s:MatchState,row:number,col:number){return s.tiles.find(t=>!t.removed&&t.row===row&&t.col===col);}

export function linkPath(s:MatchState,a:Tile,b:Tile):LinkPoint[]|null{
 if(a.id===b.id||a.removed||b.removed)return null;const R=s.rows+2,C=s.cols+2,start={row:a.row+1,col:a.col+1},end={row:b.row+1,col:b.col+1};
 const dirs=[[1,0],[0,1],[-1,0],[0,-1]];type N={row:number;col:number;dir:number;turns:number;path:LinkPoint[]};const q:N[]=[{...start,dir:-1,turns:0,path:[start]}];const best=new Map<string,number>();
 while(q.length){const n=q.shift()!;if(n.row===end.row&&n.col===end.col)return compress(n.path.map(x=>({row:x.row-1,col:x.col-1})));
  for(let d=0;d<4;d++){const nr=n.row+dirs[d][0],nc=n.col+dirs[d][1];if(nr<0||nc<0||nr>=R||nc>=C)continue;const turns=n.dir<0||n.dir===d?n.turns:n.turns+1;if(turns>2)continue;const inside=nr>0&&nc>0&&nr<=s.rows&&nc<=s.cols;const occupied=inside&&!!tileAt(s,nr-1,nc-1)&&!(nr===end.row&&nc===end.col);if(occupied)continue;const key=`${nr},${nc},${d}`;if((best.get(key)??9)<=turns)continue;best.set(key,turns);q.push({row:nr,col:nc,dir:d,turns,path:[...n.path,{row:nr,col:nc}]});}
 }
 return null;
}
function compress(path:LinkPoint[]){if(path.length<3)return path;const out=[path[0]];for(let i=1;i<path.length-1;i++){const p=path[i-1],c=path[i],n=path[i+1];if((p.row===c.row&&c.row===n.row)||(p.col===c.col&&c.col===n.col))continue;out.push(c);}out.push(path.at(-1)!);return out;}

export function availableMoves(s:MatchState){const live=s.tiles.filter(t=>!t.removed&&t.lockedUntil<=s.time);const moves:{a:Tile;b:Tile;path:LinkPoint[]}[]=[];for(let i=0;i<live.length;i++)for(let j=i+1;j<live.length;j++)if(live[i].pairKey===live[j].pairKey){const path=linkPath(s,live[i],live[j]);if(path)moves.push({a:live[i],b:live[j],path});}return moves;}
export function ensureMove(s:MatchState){if(s.status!=='playing'||s.tiles.every(t=>t.removed)||availableMoves(s).length)return;shuffleRemaining(s,false);}
export function shuffleRemaining(s:MatchState,consume=true){if(consume&&s.shuffleCharges<=0)return false;if(consume)s.shuffleCharges--;const live=s.tiles.filter(t=>!t.removed),spots=live.map(t=>({row:t.row,col:t.col}));shuffle(spots,s);live.forEach((t,i)=>Object.assign(t,spots[i]));s.selected=null;s.hint=[];s.notice='牌阵已重新整理';s.noticeUntil=s.time+2.5;if(!availableMoves(s).length&&live.length>1){const a=live[0],b=live.find(t=>t.id!==a.id&&t.pairKey===a.pairKey)!;const adjacent=spots.flatMap((one,i)=>spots.slice(i+1).map(two=>({one,two}))).find(v=>Math.abs(v.one.row-v.two.row)+Math.abs(v.one.col-v.two.col)===1);if(adjacent){const rest=live.filter(t=>t.id!==a.id&&t.id!==b.id),restSpots=spots.filter(p=>p!==adjacent.one&&p!==adjacent.two);Object.assign(a,adjacent.one);Object.assign(b,adjacent.two);rest.forEach((t,i)=>Object.assign(t,restSpots[i]));}}return true;}

export function chooseTile(s:MatchState,id:number){if(s.status!=='playing')return 'blocked';const tile=s.tiles.find(t=>t.id===id);if(!tile||tile.removed||tile.lockedUntil>s.time)return 'blocked';if(s.selected===null){s.selected=id;return 'selected';}if(s.selected===id){s.selected=null;return 'cancelled';}const first=s.tiles.find(t=>t.id===s.selected)!;s.selected=null;const def=SCENES[s.scene].pairs[tile.pairIndex];const path=first.pairKey===tile.pairKey?linkPath(s,first,tile):null;
 if(!path){s.combo=0;s.mistakes++;s.score=Math.max(0,s.score-20);s.notice=first.pairKey===tile.pairKey?'路线被其他牌阻挡':'这两项不构成安全关联';s.noticeUntil=s.time+2;return 'wrong';}
 removePair(s,first,tile,path,def.why);return 'matched';
}

function removePair(s:MatchState,a:Tile,b:Tile,path:LinkPoint[],why:string){a.removed=b.removed=true;s.matches++;s.combo++;s.bestCombo=Math.max(s.bestCombo,s.combo);s.score+=100+s.combo*15;s.lastPath=path;s.lastPathUntil=s.time+.45;s.hint=[];s.notice=why;s.noticeUntil=s.time+3.2;if(s.matches===s.totalPairs){s.status='won';s.score+=Math.max(0,Math.ceil(s.timeLimit-s.time))*10;return;}if(s.matches%4===0)scenePulse(s);ensureMove(s);}
function scenePulse(s:MatchState){const scene=SCENES[s.scene];if(scene.eventType==='shift'){shuffleRemaining(s,false);s.notice=scene.eventName+'：牌阵发生位移';}else if(scene.eventType==='fog'){s.fogUntil=s.time+5;s.notice=scene.eventName+'：文字暂时模糊';}else if(scene.eventType==='pressure'){s.time=Math.min(s.timeLimit,s.time+4+s.difficulty*2);s.notice=scene.eventName+'：处置窗口缩短';}else{const candidates=s.tiles.filter(t=>!t.removed);shuffle(candidates,s);candidates.slice(0,Math.min(4,candidates.length)).forEach(t=>t.lockedUntil=s.time+4);s.notice=scene.eventName+'：部分牌暂时锁定';}s.noticeUntil=s.time+3;}

export function tickMatch(s:MatchState,dt:number){if(s.status!=='playing')return;if(s.freezeUntil>0)s.freezeUntil=Math.max(0,s.freezeUntil-dt);else s.time+=dt;if(s.time>=s.timeLimit){s.time=s.timeLimit;s.status='lost';s.combo=0;}if(s.hintUntil<s.time)s.hint=[];}
export function showHint(s:MatchState){if(s.status!=='playing')return false;const move=availableMoves(s)[0];if(!move){ensureMove(s);return false;}s.hint=[move.a.id,move.b.id];s.hintUntil=s.time+4;s.notice=SCENES[s.scene].pairs[move.a.pairIndex].why;s.noticeUntil=s.time+4;return true;}
export function activateHeroSkill(s:MatchState){if(s.status!=='playing'||s.skillCharges<=0)return false;const move=availableMoves(s)[0];if((s.hero===1||s.hero===2)&&!move){ensureMove(s);return false;}s.skillCharges--;if(s.hero===0){shuffleRemaining(s,false);s.time=Math.max(0,s.time-10);s.notice='安全集结：重排牌阵并争取了时间';}else if(s.hero===1&&move){s.hint=[move.a.id,move.b.id];s.hintUntil=s.time+8;s.notice='洞察之眼：'+SCENES[s.scene].pairs[move.a.pairIndex].why;}else if(s.hero===2&&move){removePair(s,move.a,move.b,move.path,'迅捷转移：已完成一组正确连接');}else{s.fogUntil=0;s.tiles.forEach(t=>t.lockedUntil=0);s.freezeUntil=8;if(move){s.hint=[move.a.id,move.b.id];s.hintUntil=s.time+8;}s.notice='循迹排查：干扰解除，倒计时暂停8秒';}s.noticeUntil=s.time+4;return true;}
export function resultStars(s:MatchState){if(s.status!=='won')return 0;let stars=1;if(s.mistakes<=2)stars++;if(s.bestCombo>=6||s.time<s.timeLimit*.7)stars++;return stars;}
