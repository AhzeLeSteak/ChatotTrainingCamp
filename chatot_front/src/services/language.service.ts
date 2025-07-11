import {computed, effect, inject, Injectable, linkedSignal, signal} from '@angular/core';
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

const languages = ['jap', 'en', 'fr', 'ko', 'de'] as const;
const NAMES = [NAMES_JAP, NAMES_EN, NAMES_FR, NAMES_KO, NAMES_DE];

type Units = 'mKg' | 'lbsFt';

let unitsTrick = 0;

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  language_id = signal(parseInt(localStorage.getItem(language_key) ?? '1'));
  selected_language = computed(() => languages[this.language_id()]);
  pokemon_names_for_selected_language = computed(() => NAMES[this.language_id()]);

  _ = effect(() => {
    localStorage.setItem(language_key, this.language_id().toString());
    localStorage.setItem(unit_key, this.units().toString());
  })

  // ### Daily Part
  units = linkedSignal({
    source: () => this.selected_language(),
    computation: language =>
      (unitsTrick++ === 0)
        ? localStorage.getItem(unit_key) as Units ?? 'lbsFt'
        : language === 'en'
            ? 'lbsFt' : 'mKg'
  });
  sizeUnit = computed(() => this.units() === 'mKg' ? 'm' : 'ft');
  weightUnit = computed(() =>  this.units() === 'mKg' ? 'Kg' : 'lbs');


  dexId = inject(DexIdService).dexId();
  dailyName = computed(() => this.name_from_id(this.dexId))
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

  public name_from_id(pkId: number) {
    return this.pokemon_names_for_selected_language()[pkId-1]
  }

  public id_from_name(name: string){
    name = name.toLowerCase();
    name = this.pokemon_names_for_selected_language().find(n => n.toLowerCase() === name) ?? '';
    return this.pokemon_names_for_selected_language().indexOf(name) + 1;
  }

  public proposition_from_query(query: string){
    query = query.toLowerCase();
    return this.pokemon_names_for_selected_language().filter(n => n.toLowerCase().includes(query));
  }

}


function* chunk(str: string, size = 3) {
  for(let i = 0; i < str.length; i+= size ) yield str.slice(i, i + size);
}
