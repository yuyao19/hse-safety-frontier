import type {MatchState} from './link-engine';

const THEMES=[
 {tempo:104,root:45,scale:[0,4,7,11],wave:'triangle' as OscillatorType},
 {tempo:92,root:38,scale:[0,3,5,10],wave:'sine' as OscillatorType},
 {tempo:116,root:41,scale:[0,2,7,9],wave:'sawtooth' as OscillatorType},
 {tempo:88,root:40,scale:[0,3,7,8],wave:'triangle' as OscillatorType},
 {tempo:124,root:43,scale:[0,5,7,10],wave:'square' as OscillatorType},
 {tempo:112,root:38,scale:[0,2,5,9],wave:'triangle' as OscillatorType},
 {tempo:86,root:36,scale:[0,1,6,8],wave:'sine' as OscillatorType},
 {tempo:78,root:34,scale:[0,3,5,7],wave:'triangle' as OscillatorType},
 {tempo:96,root:43,scale:[0,3,7,10],wave:'sine' as OscillatorType},
 {tempo:118,root:38,scale:[0,5,7,10],wave:'square' as OscillatorType},
 {tempo:90,root:41,scale:[0,1,6,8],wave:'triangle' as OscillatorType},
 {tempo:74,root:34,scale:[0,1,5,7],wave:'sine' as OscillatorType},
];
const hz=(midi:number)=>440*Math.pow(2,(midi-69)/12);

export class LinkSoundtrack{
 private ctx:AudioContext;private master:GainNode;private music:GainNode;private fx:GainNode;private next=0;private beat=0;private scene=0;private enabled=true;private timer=0;
 constructor(){this.ctx=new AudioContext();this.master=this.ctx.createGain();this.music=this.ctx.createGain();this.fx=this.ctx.createGain();this.master.gain.value=.65;this.music.gain.value=.11;this.fx.gain.value=.32;this.music.connect(this.master);this.fx.connect(this.master);this.master.connect(this.ctx.destination)}
 setEnabled(value:boolean){this.enabled=value;this.master.gain.setTargetAtTime(value?.65:.0001,this.ctx.currentTime,.08);if(value&&this.ctx.state!=='running')void this.ctx.resume()}
 start(scene:number){this.scene=scene;this.beat=0;this.next=this.ctx.currentTime+.05;this.timer=0;if(this.ctx.state!=='running')void this.ctx.resume()}
 update(s:MatchState,paused=false){if(!this.enabled)return;const now=this.ctx.currentTime;if(paused||s.status!=='playing'){this.music.gain.setTargetAtTime(.025,now,.15);return}const intensity=Math.min(1,s.combo/8+(s.time/s.timeLimit)*.35);this.music.gain.setTargetAtTime(.09+intensity*.06,now,.12);this.timer+=.1;if(this.timer<.18)return;this.timer=0;const theme=THEMES[this.scene];while(this.next<now+.1){const bar=this.beat%8,step=theme.scale[(this.beat+this.scene)%theme.scale.length];if(bar%2===0)this.tone(hz(theme.root+12+step),this.next,.16,theme.wave,this.music,.027+intensity*.015);if(bar===0)this.tone(hz(theme.root-12),this.next,.65,'sine',this.music,.05);if(s.combo>=4&&bar%2===1)this.tone(hz(theme.root+24+step),this.next,.07,'sine',this.music,.015);this.next+=60/theme.tempo;this.beat++}}
 cue(kind:'tap'|'match'|'wrong'|'skill'|'hint'|'shuffle'|'win'|'lost'){if(!this.enabled)return;const notes={tap:[61],match:[67,74],wrong:[40,37],skill:[55,62,67],hint:[64,69],shuffle:[52,57,61],win:[60,64,67,72],lost:[45,41,38]}[kind];notes.forEach((n,i)=>this.tone(hz(n),this.ctx.currentTime+i*.065,.09,kind==='wrong'?'square':'sine',this.fx,kind==='win'?.1:.055))}
 private tone(freq:number,at:number,duration:number,wave:OscillatorType,target:AudioNode,level:number){const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=wave;o.frequency.value=freq;g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(level,at+.015);g.gain.exponentialRampToValueAtTime(.0001,at+duration);o.connect(g);g.connect(target);o.start(at);o.stop(at+duration+.03)}
}
