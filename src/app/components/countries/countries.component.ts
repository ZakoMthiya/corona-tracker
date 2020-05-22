import { Component, OnInit, ViewChild } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GloabalDataSummary } from 'src/app/models/global-data';
import { DateWiseData } from 'src/app/models/date-wise-data';
import { GoogleChartInterface } from 'ng2-google-charts';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  loading = true;
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  data: GloabalDataSummary[];
  countries: string[] = [];
  dateWiseData;
  selectedCountryData: DateWiseData[];
  lineChart: GoogleChartInterface = {
    chartType: 'LineChart'
  };

  // Mat table
  tableColumns: string[] = ['date', 'cases'];
  dataSource;

  pageIndex:number = 0;
  pageSize:number = 50;
  lowValue:number = 0;
  highValue:number = 10;

  constructor(private dataService: DataServiceService) { }

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  ngAfterViewInit (){
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {

    merge(
      this.dataService.getDateWiseData().pipe(
        map(result => {
          this.dateWiseData = result;
        })
      ),
      this.dataService.getGlobalData().pipe(
        map(result => {
          this.data = result;
          this.data.forEach(cs => {
            this.countries.push(cs.country);
          })
        })
      )
    ).subscribe(
      {
        complete: () => {
          this.updateValues('South Africa');
          this.loading = false;
        }
      }
    )
  }


  updateChart() {
    let dataTable = [];
    dataTable.push(["Date", "Cases"]);
    this.selectedCountryData.forEach(cs => {
      dataTable.push([cs.date, cs.cases]);
    })

    this.lineChart = {
      chartType: 'LineChart',
      dataTable: dataTable,
      //firstRowIsData: true,
      options: {
        height: 400,
        animation: {
          duration: 1000,
          easing: 'out',
        }
      },

    }
  }

  updateValues(country: string) {
    console.log(country);
    this.data.forEach(cs => {
      if (cs.country == country) {
        this.totalActive = cs.active
        this.totalConfirmed = cs.confirmed
        this.totalDeaths = cs.deaths
        this.totalRecovered = cs.recovered
      }
    })
    this.selectedCountryData = this.dateWiseData[country];
    this.dataSource = new MatTableDataSource(this.selectedCountryData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log(this.sort);
    this.updateChart();
  }
}
