import { Injectable } from '@angular/core';
import {NAMES_JAP} from '../consts/pokemon-names-jap';
import {NAMES_EN} from '../consts/pokemon-names-en';
import {NAMES_FR} from '../consts/pokemon-names-fr';
import {NAMES_KO} from '../consts/pokemon-names-ko';
import {NAMES_DE} from '../consts/pokemon-names-de';

const key = 'LANGUAGE';
const LANGUAGES = [NAMES_JAP, NAMES_EN, NAMES_FR, NAMES_KO, NAMES_DE];

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  public readonly languages = ['jap', 'en', 'fr', 'ko', 'de'] as const;
  private _language_id = parseInt(localStorage.getItem(key) ?? '1');

  public name(pkid: number){
    return this.LANGUAGE[pkid-1];
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
    return LANGUAGES[this.language_id];
  }

  get selected_language(){
    return this.languages[this.language_id];
  }

  get language_id(){
    return this._language_id;
  }

  set language_id(value: number){
    this._language_id = value;
    localStorage.setItem(key, value.toString());
  }

}
