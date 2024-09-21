import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, Validators,ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-order-stepper',
  standalone: true,imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './order-stepper.component.html',
  styleUrl: './order-stepper.component.css'
})
export class OrderStepperComponent {
  constructor(private fb: FormBuilder){

  }
  private _formBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;

}
