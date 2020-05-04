import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ApiServiceService } from '../api-service.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  providers: [DatePipe]
})
export class LoginPageComponent implements OnInit {
  @ViewChild('fileInput') el: ElementRef;
  public loginPageForm: FormGroup;
  public viewRegisterPage = false;
  public countries: any;
  public submitted = false;
  editFile = true;
  removeUpload = false;
  public selectedCountry: any;
  public imageUrl: any = 'https://i.pinimg.com/236x/d6/27/d9/d627d9cda385317de4812a4f7bd922e9--man--iron-man.jpg';
  constructor(private readonly fb: FormBuilder,
              private httpClient: HttpClient,
              private apiService: ApiServiceService,
              private date: DatePipe,
              private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initForm();
    this.httpClient.get('https://restcountries.eu/rest/v2/all').subscribe(data => {
      this.countries = data;
    });
  }
  /**
   * @function getSelectedValue
   * @param data selected value select dropdown
   * @description used to write formcontrols and call it on onload
   * @author Gopi krishna
   */
  getSelectedValue(data) {
    this.selectedCountry = data.name;
  }
  /**
   * @function initForm
   * @description used to write formcontrols and call it on onload
   * @author Gopi krishna
   */
  initForm() {
    this.loginPageForm = this.fb.group({
      dob: [null, Validators.required],
      userName: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      name: [null, [Validators.required, Validators.minLength(3), Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      email: [null, Validators.required],
      country: [null, Validators.required]
    });
  }
  /**
   * @function navToRegister
   * @description used to view registration page
   * @author Gopi krishna
   */
  navToRegister() {
    this.viewRegisterPage = true;
  }
  /**
   * @function backToLogin
   * @description used to view registration page
   * @author Gopi krishna
   */
  backToLogin() {
    this.viewRegisterPage = false;
  }
  /**
   * @function form
   * @description used to to get the form details
   * @author Gopi krishna
   */
  get form() {
    return this.loginPageForm.controls;
  }

  /**
   * @function backToLogin
   * @description used to view registration page
   * @author Gopi krishna
   */
  createUser() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginPageForm.invalid) {
        return;
    }
    const formData = this.loginPageForm.value;
    const payload = {
      name: formData.name,
      email: formData.email,
      dob: this.date.transform(formData.dob, 'yyyy-MM-dd'),
      country: this.selectedCountry,
      // password: 'password',
      avatar: 'https://www.fnordware.com/superpng/samples.html'
    };
    this.apiService.createUser(payload).subscribe(res => {
      console.log('create user api', res);
    });
  }
  uploadFile(event) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);

      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.loginPageForm.patchValue({
          file: reader.result
        });
        this.editFile = false;
        this.removeUpload = true;
      }
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }
}
