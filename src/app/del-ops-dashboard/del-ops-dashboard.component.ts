import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
//import { NumericEditor } from '../numeric-editor.component';

@Component({
  selector: 'app-del-ops-dashboard',
  templateUrl: './del-ops-dashboard.component.html',
  styleUrls: ['./del-ops-dashboard.component.css']
})

export class DelOpsDashboardComponent {
  gridApi: any;
  columnApi: any;
  private editType;
  columnDefs;
  private editedRowData: JSON;
  private newData: any;
  saveData: boolean = false;
  private frameworkComponents;
  private defaultColDef;

  constructor(private http: HttpClient) {

    this.frameworkComponents = {
      //numericEditor: NumericEditor
    };
    this.defaultColDef = {
      editable: true,
      sortable: true,
      flex: 0,
      minWidth: 110,
      filter: true,
      resizable: true,
    };

    this.saveData = false;
    this.columnDefs = [
      { headerName: `Chorus Code`, field: `chorusCode`, sortable: true, editable: false, width:140 }, //project master model
      { headerName: 'Velocity Project Code', field: `projectCode`, sortable: true, editable: false, width: 190},
      { headerName: `Project Name`, field: `projectName`, sortable: true, editable: false, width:140 }, //project master model -> velocity code
      { headerName: `Project Health`, field: `projectHealth`, sortable: true, editable: true, width:150 }, //project leading model
      { headerName: `Onsite FTE Count`, field: `onsiteFteCount`, sortable: true, editable: false, width:180}, // ?     cellEditor: 'numericEditor',
      { headerName: `Offshore FTE Count`, field: `offshoreFteCount`, sortable: true, editable: false, width:180 }, // ?   cellEditor: 'numericEditor',
      { headerName: `Past Due RRs`, field: `pastDueRrs`, sortable: true, editable: true, width:140 }, //project leading model   cellEditor: 'numericEditor',
      { headerName: `Ageing of Past Due RRs`, field: `ageingOfPastDueRrs`, sortable: true, editable: true, width:190 }, //project leading model cellEditor: 'numericEditor'
      { headerName: `Resource Onboarding Delays`, field: `resourceOnboardingDelay`, sortable: true, editable: true, width:200 }, //project leading model cellEditor: 'numericEditor',
      { headerName: `EIQ Baselining of resources`, field: `eiqBaseliningOfResources`, sortable: true, editable: true, width:200 }, //project leading model
      { headerName: `Attrition Count`, field: `attritionCount`, sortable: true, editable: true, width:180 }, //project leading model   cellEditor: 'numericEditor',
      { headerName: `Q2 Revenue (Million)`, field: `revenue`, sortable: true, editable: true, width:180 }, //project leading model   cellEditor: 'numericEditor',
      { headerName: `Q2 Cost (Million)`, field: `cost`, sortable: true, editable: true, width:170 }, //project leading model        cellEditor: 'numericEditor',
      { headerName: `Q2 Margin %`, field: `margin`, sortable: true, editable: true, width:140 }, //project leading model            cellEditor: 'numericEditor',
      { headerName: `Year`, field: `year`, sortable: true, width:140, hide:true },
      { headerName: `Month`, field: `month`, sortable: true, width:140, hide:true },
    ];
    this.editType = 'fullRow';
  }

  OnGridReady(params) {
    this.saveData = true;
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.http.get('http://localhost:8002/api/citi-portal/dev-ops/details').subscribe(data => {//perform the async call
      this.newData = data;
      console.log(this.newData);
      this.gridApi.setColumnDefs(this.columnDefs);
      this.gridApi.setRowData(this.newData);
    });
  }

  // OnRowValueChanged(params) {
  //   console.log("row value changed.")
  //   this.saveData = false;
  //   this.editedRowData = params.data;
  //   console.log(this.editedRowData);
  // }
  //
  // OnRowEditingStopped(params){
  //   console.log("row editing stopped.")
  //   console.log(params);
  // }


  OnCellValueChanged(params){
    console.log("Cell value changed.")
    console.log(params);
    this.saveData = false;
    this.editedRowData = params.data;
  }

  OnSaveChanges() {
    let data: any = {};
    data = this.editedRowData;
    let projectCode = data.projectCode;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    this.http.put('http://localhost:8002/api/citi-portal/dev-ops/'+projectCode , this.editedRowData, httpOptions).subscribe(
      val => {
        console.log("PUT call successful value returned in body", val);
      },
      response => {
        console.log("PUT call in error", response);
      },
      () => {
        console.log("The PUT observable is now completed.");
        this.saveData = true;
//        this.gridApi.refreshCells();
        this.gridApi.redrawRows();
        this.gridApi.setRowData(this.newData);
      }
    );
  }

  OnRowDoubleClicked(params) {
    this.saveData = false;
  }

}


/*
The data model for this dashboard can be captured from
1. PROJECT LEADING INDICATOR
2. CHORUS MASTER
3. PROJECT MASTER
4. SOW MASTER
5. PROGRAM MASTER

*/
