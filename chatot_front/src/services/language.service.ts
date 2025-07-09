import {computed, effect, inject, Injectable, signal} from '@angular/core';
import {NAMES_JAP} from '../consts/pokemon-names-jap';
import {NAMES_EN} from '../consts/pokemon-names-en';
import {NAMES_FR} from '../consts/pokemon-names-fr';
import {NAMES_KO} from '../consts/pokemon-names-ko';
import {NAMES_DE} from '../consts/pokemon-names-de';
import {GENERA} from '../consts/genera';
import {WEIGHT_SIZE} from '../consts/pokemon-weight-size';
import {ENTRIES} from '../consts/entries';
import {DexIdService} from './dex-id.service';

const language_key = 'LANGUAGE';
const unit_key = 'UNITS';
const NAMES = [NAMES_JAP, NAMES_EN, NAMES_FR, NAMES_KO, NAMES_DE];

type Units = 'mKg' | 'lbsFt';

function* chunk(str: string, size = 3) {
  for(let i = 0; i < str.length; i+= size ) yield str.slice(i, i + size);
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  public readonly languages = ['jap', 'en', 'fr', 'ko', 'de'] as const;

  language_id = signal(parseInt(localStorage.getItem(language_key) ?? '1'));

  units = signal(localStorage.getItem(unit_key) as Units ?? 'lbsFt');
  sizeUnit = computed(() => this.units() === 'mKg' ? 'm' : 'ft');
  weightUnit = computed(() =>  this.units() === 'mKg' ? 'Kg' : 'lbs');

  public LANGUAGE = computed(() => NAMES[this.language_id()]);


  selected_language = computed(() => this.languages[this.language_id()]);

  _ = effect(() => {
    localStorage.setItem(language_key, this.language_id().toString());
    if(this.selected_language() === 'en')
      this.units.set('lbsFt')
    else
      this.units.set('mKg');

    localStorage.setItem(unit_key, this.units().toString());
  }, {
    allowSignalWrites: true
  })


  // ### Daily Part
  dexId = inject(DexIdService).dexId();
  dailyName = computed(() => this.name(this.dexId))
  dailyGenera = computed(() => GENERA[this.dexId-1][this.selected_language()] ?? GENERA[this.dexId-1]['en']);
  dailySize = computed(() => {
    const size = WEIGHT_SIZE[this.dexId-1];
    return this.units() === 'mKg' ? size.m : size.ft.replaceAll('′', "'").replaceAll('″', '"');
  });
  dailyWeight = computed(() => {
    const weight = WEIGHT_SIZE[this.dexId-1];
    return this.units() === 'mKg' ? weight.kgs : weight.lbs;
  });

  dailyEntry = computed(() =>{
    const name = this.dailyName();
    const entry = ENTRIES[this.dexId-1][this.selected_language()] ?? ENTRIES[this.dexId-1]['en'];
    const words = entry.replaceAll(new RegExp(name, 'gi'), '???').replaceAll('\n', ' ').split(' ');
    if(this.selected_language() === 'ko') return [...chunk(words.join(' '), 17)].join(' ')

    const lines: string[][] = [[]];
    const treshold = 26;
    let length = 0;
    for(let word of words){
      if(length + word.length > treshold){
        lines.push([]);
        length = 0;
      }
      length += word.length;
      lines[lines.length - 1].push(word);
    }
    let res = '';
    for(let line of lines){
      res += line.join(' ');
      res += ' ';
    }
    return res;
  })

  public name(pkId: number) {
    return this.LANGUAGE()[pkId-1]
  }

  public get_id_from_name(name: string){
    name = name.toLowerCase();
    name = this.LANGUAGE().find(n => n.toLowerCase() === name) ?? '';
    return this.LANGUAGE().indexOf(name) + 1;
  }

  public get_propositions(name: string){
    name = name.toLowerCase();
    return this.LANGUAGE().filter(n => n.toLowerCase().includes(name));
  }

}
