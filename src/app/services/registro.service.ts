import { Injectable } from '@angular/core';



export interface Alumno {
  nombre: string;
  telefono: number;
  correo: string;
}

const ALUMNOS_KEY = 'alumnos-registrados';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  listaAlumnos: Alumno[] = [];

  constructor() {
    this.cargaAlumnos();
  }

  cargaAlumnos(){
    let alumnos = localStorage.getItem(ALUMNOS_KEY) as string;
    if(alumnos =='' || alumnos==null || alumnos=='undefined'){
      this.listaAlumnos = [];
      console.log('listaAlumnos', this.listaAlumnos);
    }else{
      this.listaAlumnos = JSON.parse(alumnos);
      console.log('ArraylistaAlumnos', this.listaAlumnos);
    }
  }

  nuevoAlumno(alumno: Alumno){
    this.listaAlumnos.push(alumno);
    localStorage.setItem(ALUMNOS_KEY, JSON.stringify(this.listaAlumnos))
  }


  loginAlumno(email:string){
    let usuarioCorrecto = this.listaAlumnos.find( alumno => alumno.correo === email );
    return usuarioCorrecto;
  }

}
