import type {State} from './engine';

export const SOUNDTRACKS=[
 {title:'净流脉冲',tempo:82,root:43,scale:[0,3,7,10],wave:'sine' as OscillatorType,tint:1200},
 {title:'闭店之后',tempo:96,root:45,scale:[0,2,7,9],wave:'triangle' as OscillatorType,tint:1750},
 {title:'交叉物流线',tempo:116,root:38,scale:[0,5,7,10],wave:'square' as OscillatorType,tint:950},
 {title:'联锁节拍',tempo:124,root:40,scale:[0,3,5,7,10],wave:'sawtooth' as OscillatorType,tint:1350},
 {title:'紫雾边界',tempo:88,root:41,scale:[0,1,6,8],wave:'triangle' as OscillatorType,tint:720},
 {title:'熔光重奏',tempo:128,root:36,scale:[0,3,7,8],wave:'sawtooth' as OscillatorType,tint:1100},
 {title:'山体回声',tempo:92,root:38,scale:[0,2,5,9],wave:'triangle' as OscillatorType,tint:820},
 {title:'深地呼吸',tempo:74,root:34,scale:[0,1,5,7],wave:'sine' as OscillatorType,tint:560},
];

const hz=(midi:number)=>440*Math.pow(2,(midi-69)/12);

export class AdaptiveSoundtrack{
 private ctx:AudioContext;
 private master:GainNode;
 private music:GainNode;
 private fx:GainNode;
 private filter:BiquadFilterNode;
 private delay:DelayNode;
 private feedback:GainNode;
 private noise:AudioBuffer;
 private nextBeat=0;
 private beat=0;
 private chapter=0;
 private on=true;
 private lastStep=-1;
 private lastStatus='';

 constructor(){
  this.ctx=new AudioContext();this.master=this.ctx.createGain();this.music=this.ctx.createGain();this.fx=this.ctx.createGain();this.filter=this.ctx.createBiquadFilter();this.delay=this.ctx.createDelay(.8);this.feedback=this.ctx.createGain();
  this.master.gain.value=.72;this.music.gain.value=.12;this.fx.gain.value=.38;this.filter.type='lowpass';this.filter.frequency.value=1600;this.delay.delayTime.value=.28;this.feedback.gain.value=.18;
  this.music.connect(this.filter);this.filter.connect(this.master);this.filter.connect(this.delay);this.delay.connect(this.feedback);this.feedback.connect(this.delay);this.delay.connect(this.master);this.fx.connect(this.master);this.master.connect(this.ctx.destination);
  this.noise=this.ctx.createBuffer(1,Math.floor(this.ctx.sampleRate*.12),this.ctx.sampleRate);const data=this.noise.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/data.length,2);
 }
 async resume(){if(this.ctx.state!=='running')await this.ctx.resume();}
 setEnabled(value:boolean){this.on=value;this.master.gain.setTargetAtTime(value?.72:.0001,this.ctx.currentTime,.08);if(value)void this.resume();}
 start(chapter:number){this.chapter=chapter;this.beat=0;this.nextBeat=this.ctx.currentTime+.06;this.lastStep=-1;this.lastStatus='';void this.resume();}
 update(s:State,paused=false){if(!this.on)return;const now=this.ctx.currentTime,intensity=paused?0:Math.min(1,(s.pressure/100)*.65+(s.step>=3?.22:0)+(s.enemies.some(e=>e.boss&&!e.dead&&e.phase)?.2:0));this.music.gain.setTargetAtTime(paused?.035:.105+intensity*.055,now,.18);this.filter.frequency.setTargetAtTime(SOUNDTRACKS[this.chapter].tint+intensity*1600,now,.22);if(s.step!==this.lastStep){if(this.lastStep>=0)this.cue('complete');this.lastStep=s.step;}if(s.status!==this.lastStatus){if(s.status==='won')this.cue('win');if(s.status==='lost')this.cue('lost');this.lastStatus=s.status;}if(paused||s.status!=='playing')return;while(this.nextBeat<now+.12){this.scheduleBeat(this.nextBeat,intensity);this.nextBeat+=60/SOUNDTRACKS[this.chapter].tempo;this.beat++;}}
 cue(kind:'hit'|'kill'|'complete'|'skill'|'win'|'lost') {if(!this.on)return;const notes={hit:[38,35],kill:[67,74],complete:[64,69,76],skill:[55,62,67],win:[60,64,67,72],lost:[45,41,38]}[kind];notes.forEach((n,i)=>this.tone(hz(n),this.ctx.currentTime+i*.07,.08,kind==='hit'?'square':'sine',this.fx,kind==='win'?.11:.065));}
 private scheduleBeat(at:number,intensity:number){const p=SOUNDTRACKS[this.chapter],step=p.scale[(this.beat+(this.chapter%3))%p.scale.length],bar=this.beat%8;if(bar%2===0)this.tone(hz(p.root+step+12),at,.16,p.wave,this.music,.035+intensity*.015);if(bar===0)this.tone(hz(p.root-12),at,.9,'sine',this.music,.055);if(intensity>.28&&bar%2===0)this.drum(at,bar===0?.065:.035);if(intensity>.65&&bar%2===1)this.tone(hz(p.root+24+p.scale[(bar+2)%p.scale.length]),at,.09,'square',this.music,.018);}
 private tone(freq:number,at:number,duration:number,wave:OscillatorType,target:AudioNode,level:number){const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=wave;o.frequency.setValueAtTime(freq,at);g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(level,at+.018);g.gain.exponentialRampToValueAtTime(.0001,at+duration);o.connect(g);g.connect(target);o.start(at);o.stop(at+duration+.03);}
 private drum(at:number,level:number){const s=this.ctx.createBufferSource(),f=this.ctx.createBiquadFilter(),g=this.ctx.createGain();s.buffer=this.noise;f.type=this.chapter===7?'lowpass':'bandpass';f.frequency.value=this.chapter===5?420:150+this.chapter*65;g.gain.setValueAtTime(level,at);g.gain.exponentialRampToValueAtTime(.0001,at+.11);s.connect(f);f.connect(g);g.connect(this.music);s.start(at);}
}
