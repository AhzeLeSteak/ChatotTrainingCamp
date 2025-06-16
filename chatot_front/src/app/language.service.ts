import { Injectable } from '@angular/core';
import {NAMES_JAP} from '../consts/pokemon-names-jap';
import {NAMES_EN} from '../consts/pokemon-names-en';
import {NAMES_FR} from '../consts/pokemon-names-fr';
import {NAMES_KO} from '../consts/pokemon-names-ko';
import {NAMES_DE} from '../consts/pokemon-names-de';
import {GENERA} from '../consts/genera';
import {WEIGHT_SIZE} from '../consts/pokemon-weight-size';
import {ENTRIES} from '../consts/entries';

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
  private _language_id = parseInt(localStorage.getItem(language_key) ?? '1');
  private units: Units = localStorage.getItem(unit_key) as Units ?? 'lbsFt';

  public name(pkid: number){
    return this.LANGUAGE[pkid-1];
  }

  public genera(pkId: number){
    return GENERA[pkId-1][this.selected_language] ?? GENERA[pkId-1]['en'];
  }

  public entry(pkId: number){
    const name = this.name(pkId);
    const entry = ENTRIES[pkId-1][this.selected_language] ?? ENTRIES[pkId]['en'];
    const words = entry.replaceAll(new RegExp(name, 'gi'), '???').replaceAll('\n', ' ').split(' ');
    if(this.selected_language === 'ko') return [...chunk(words.join(' '), 17)].join(' ')

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
  }

  public size(pkId: number){
    const size = WEIGHT_SIZE[pkId-1];
    return this.units === 'mKg' ? size.m : size.ft.replaceAll('′', "'").replaceAll('″', '"');
  }

  get sizeUnit(){
    return this.units === 'mKg' ? 'm' : 'ft';
  }

  public weight(pkId: number){
    const weight = WEIGHT_SIZE[pkId-1];
    return this.units === 'mKg' ? weight.kgs : weight.lbs;
  }

  get weightUnit(){
    return this.units === 'mKg' ? 'Kg' : 'lbs';
  }

  public dexId(name: string){
    name = name.toLowerCase();
    name = this.LANGUAGE.find(n => n.toLowerCase() === name) ?? '';
    return this.LANGUAGE.indexOf(name) + 1;
  }

  public get_propositions(name: string){
    name = name.toLowerCase();
    return this.LANGUAGE.filter(n => n.toLowerCase().includes(name));
  }

  get LANGUAGE(){
    return NAMES[this.language_id];
  }

  get selected_language(){
    return this.languages[this.language_id];
  }

  get language_id(){
    return this._language_id;
  }

  set language_id(value: number){
    this._language_id = value;
    localStorage.setItem(language_key, value.toString());
  }

  setUnits(units: Units){
    this.units = units;
    localStorage.setItem(unit_key, units);
  }

}
