import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RegistroService, Alumno } from '../../services/registro.service';
import { CalificacionesService, Materia } from '../../services/calificaciones.service';


declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})


export class HomeComponent implements OnInit {

  //login
  isLogin = false;
  loginForm: FormGroup;
  respuestaLogin: any;
  isSubmitLogin: Boolean = false;

  //registro
  registroForm: FormGroup;
  respuestaRegistro: any;
  isSubmitReg: Boolean = false;

  //materia
  formMateria: FormGroup;
  isSubmitMat:boolean = false;
  nuevaMateria: Materia = <Materia>{ id:0 };
  materiaModifica: Materia = <Materia>{ };
  materias: Materia[] = [];

  nuevoAlumno: Alumno = <Alumno> {};



  constructor( private router: Router, public formBuilder:FormBuilder, private registroSerevice: RegistroService, private materiaService: CalificacionesService ) { 
      
    this.loginForm = this.formBuilder.group({
      emaillogin:['', [Validators.required]],
      //inputPassword3:['', [Validators.required]]
    });

    this.registroForm = this.formBuilder.group({
      nombre:['', [Validators.required,Validators.minLength(3),Validators.maxLength(100),Validators.pattern('[a-z A-Z ÁÉÍÓÚ áéíóú]*')]],
      telefono:['', [Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      correo:['', [Validators.required, Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')]],
      //estadoregistro:['', [Validators.required,  Validators.pattern('[a-z A-Z ÁÉÍÓÚ áéíóú ]*')]],
      
    });
    
    this.formMateria = this.formBuilder.group({
      alumno:[''],
      materia:['', [Validators.required,Validators.minLength(3),Validators.maxLength(100),Validators.pattern('[a-z A-Z ÁÉÍÓÚ áéíóú]*')]],
      calificacion:['', [Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern('[0-9]*')]],

    });

  }

  ngOnInit(): void {
  }

  loginusr(){
    
    this.isSubmitLogin= true;
    if(this.loginForm.valid){
      //console.log(this.loginForm.value.emaillogin);
      
      let loginCorrecto = this.registroSerevice.loginAlumno(this.loginForm.value.emaillogin)
      if(loginCorrecto){
        this.nuevoAlumno = loginCorrecto;
        this.isLogin = true;
        this.formMateria.patchValue({alumno : this.nuevoAlumno.correo});
        this.listaDeMaterias();
        Swal.fire({
           //allowOutsideClick: false,
           title: 'Login correcto',
           icon: 'success',
           confirmButtonText: 'Aceptar'
         });
      }else{
        Swal.fire({
           //allowOutsideClick: false,
           title: 'Alumno no encontrado',
           icon: 'error',
           confirmButtonText: 'Aceptar'
         });
      }
      
       

    }
  }

  registrousr(){
    this.isSubmitReg = true;
    if(this.registroForm.valid){

      this.nuevoAlumno = this.registroForm.value;
      //console.log(this.nuevoAlumno);

      let loginCorrecto = this.registroSerevice.loginAlumno(this.nuevoAlumno.correo)
      if(loginCorrecto){
        //ya existe
        Swal.fire({
           //allowOutsideClick: false,
           title: 'Alumno ya registrado',
           icon: 'error',
           confirmButtonText: 'Aceptar'
         });
      }else{
        //registro nuevo
        this.registroSerevice.nuevoAlumno(this.nuevoAlumno);
        this.isLogin = true;
        this.formMateria.patchValue({alumno : this.nuevoAlumno.correo});
        this.listaDeMaterias();
        Swal.fire({
           //allowOutsideClick: false,
           title: 'Registro correcto',
           icon: 'success',
           confirmButtonText: 'Aceptar'
         }); 
      }      
    }
  }

  registroMat(){
    this.isSubmitMat = true;
    if(this.formMateria.valid){

      this.nuevaMateria = this.formMateria.value;
      this.materiaService.nuevaMateria(this.nuevaMateria);
      this.materias = this.materiaService.cargaMaterias(this.nuevoAlumno.correo);

      $("#exampleModal").modal("hide");

      Swal.fire({
         //allowOutsideClick: false,
         title: 'Materia Registrada',
         icon: 'success',
         confirmButtonText: 'Aceptar'
       });
    }
  }

  listaDeMaterias(){
    this.materias = this.materiaService.cargaMaterias(this.nuevoAlumno.correo);
    
  }

  eliminaMateria(id: number, alumno:string){
    this.materias = this.materiaService.eliminaMateria(id, alumno);
  }

  popActualiza(id: number, materia:string) {
    //console.log(id);
    Swal.fire({
      title: '¿Estas seguro?',
      icon: 'info',
      input: 'number',
      text: `Modifica calificacion de ${materia}`,
      confirmButtonText: 'Aceptar',
      showCancelButton: true,

    }).then((result) => {
      if (result.isConfirmed) {
        console.log('idProd: ',id);
        console.log('nuevaCalif: ', result.value);
        this.actualizaMatera(id, result.value);
        
      }
    });
  }


  actualizaMatera(id:number, nuevaCalificacion:number){
    this.materiaModifica = this.materias[this.materias.findIndex(item => item.id == id)]
    this.materiaModifica.calificacion = nuevaCalificacion;
    console.log(this.materiaModifica);     
    this.materias = this.materiaService.modificaMaeria(this.materiaModifica)
  }

  salir(){
    this.isLogin= false;
    this.materias = [];
    this.formMateria.reset();
    this.loginForm.reset();
  }

}