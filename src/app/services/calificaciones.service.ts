import { Injectable } from '@angular/core';


export interface Materia {
  id:number;
  materia: string;
  calificacion: number;
  alumno: string;
}

const MATERIA_KEY = 'materias-registradas';

@Injectable({
  providedIn: 'root'
})
export class CalificacionesService {

  listaMaterias: Materia[] = [];

  constructor() {
  
  }

  cargaMaterias(alumno:string){
    let materiasArr = localStorage.getItem(MATERIA_KEY) as string;
    if(materiasArr =='' || materiasArr==null || materiasArr=='undefined'){
      this.listaMaterias = [];
    }else{
      this.listaMaterias = JSON.parse(materiasArr);
    }

    return this.listaMaterias.filter(materia => materia.alumno === alumno)
  }

  nuevaMateria(nMateria: Materia){
    let materiasIds = this.listaMaterias.map(item => item.id);
    let newId = materiasIds.length > 0 ? Math.max.apply(Math, materiasIds) + 1 : 1;
    nMateria.id = newId;

    this.listaMaterias.push(nMateria);
    localStorage.setItem(MATERIA_KEY, JSON.stringify(this.listaMaterias))

    return this.listaMaterias.filter(materia => materia.alumno === nMateria.alumno)
  }

  modificaMaeria(aMateria: Materia){
    let materiaAnterior = this.listaMaterias.findIndex(item => item.id == aMateria.id) 
    this.listaMaterias.splice(materiaAnterior, 1, aMateria);
    localStorage.setItem(MATERIA_KEY, JSON.stringify(this.listaMaterias))
    return this.listaMaterias.filter(materia => materia.alumno === aMateria.alumno)
  }


  eliminaMateria(id:number, alumno:string){
    let index = this.listaMaterias.findIndex(item => item.id === id);
      if (index > -1) {
          this.listaMaterias.splice(index, 1);
      }
      localStorage.setItem(MATERIA_KEY, JSON.stringify(this.listaMaterias))
      return this.listaMaterias.filter(materia => materia.alumno === alumno)
  }

}
