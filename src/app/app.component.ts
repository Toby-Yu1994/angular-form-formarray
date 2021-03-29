import { Component, OnInit } from "@angular/core";
import { BuyerResp } from "./buyerResp.model";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [FormBuilder]
})
export class AppComponent implements OnInit {
  // 1. get JSON object from servlet. must be array
  buyersHDBrespJSON: JSON = <JSON>(
    (<unknown>[
      { name: "toby1", age: "55" },
      { name: "ZH2", age: "35" },
      { name: "sumi3", age: "35" }
    ])
  );
  buyersHDBresp: BuyerResp<any>[] = [];
  buyers = new Array<any>(); // declare type and instantiate
  form: FormGroup;
  buyerForm: FormArray;

  constructor(private fb: FormBuilder) {
    // parameters in constructor need to be provided
  }

  ngOnInit(): void {
    // 2. parse JSON to object array
    Object.assign(this.buyersHDBresp, this.buyersHDBrespJSON);
    // 3. loop buyers array to create
    this.createBuyersArray(this.buyersHDBresp.length);
    // initialize form
    this.form = this.fb.group({ buyerForm: this.fb.array([]) });
    // push group of controls based on buyers number
    this.createBuyerForms(this.buyersHDBresp.length);
    console.log(this.buyers);
    console.log(this.buyerForm);
  }

  onSubmit() {
    console.log(this.buyerForm);
    console.log(this.buyerForm.controls[0].get("oa").value);
  }

  createBuyersArray(noOfBuyers: number) {
    // for each method will overwrite all elements with last one!
    let i = 0;
    for (i = 0; i < noOfBuyers; i++) {
      this.buyers[i] = this.buyersHDBresp[i];
    }
  }

  createBuyerForms(noOfBuyers: number) {
    let i = 0;
    for (i = 0; i < noOfBuyers; i++) {
      this.buyerForm = this.form.get("buyerForm") as FormArray;
      // have to declare as FormArray to push elements
      let buyer = this.fb.group({
        oa: ["", Validators.required],
        input: ["", Validators.required]
      });
      this.buyerForm.push(buyer);
    }
  }

  validateInput(i: number): boolean {
    if (
      this.buyerForm.controls[i].get("input").value >
      this.buyerForm.controls[i].get("oa").value
    ) {
      this.buyerForm.controls[i]
        .get("input")
        .setErrors({ "input greater than oa": true });
      // use setError to toggle formControl and parents validity
      return true;
    }
  }

  disableControl() {
    this.buyerForm.controls[0].get("input").disable();
  }
  //disable use: control .disable()  ; not disabled(return boolean) not disable(return propoerty)
}
// reference: https://netbasal.com/angular-reactive-forms-the-ultimate-guide-to-formarray-3adbe6b0b61a

// compile error NG8002 solution add to spec.ts supercede errors
// beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ yourcomponent ],
//       schemas: [NO_ERRORS_SCHEMA]
//     })
//     .compileComponents();
//   }));

// NG8004 ERROR pipe missing
// https://www.angularjswiki.com/angular/how-to-use-angular-pipes-in-components-and-services/
