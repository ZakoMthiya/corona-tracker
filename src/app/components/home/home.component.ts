import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GloabalDataSummary } from 'src/app/models/global-data';
import { GoogleChartInterface } from 'ng2-google-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loading = true;
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  globalData: GloabalDataSummary[];
  pieChart: GoogleChartInterface = {
    chartType: 'PieChart'
  };
  columnChart: GoogleChartInterface = {
    chartType: 'ColumnChart'
  }

  constructor(private dataService: DataServiceService) { }

  updateChart(input: HTMLInputElement) {
    console.log(input.value);
    let c = input.value;
    this.initChart(c);
  }


  ngOnInit() {
    this.dataService.getGlobalData().subscribe({
      next: (result => {
        console.log(result);
        this.globalData = result;
        result.forEach(cs => {
          if (!Number.isNaN(cs.confirmed)) {
            this.totalActive += cs.active
            this.totalConfirmed += cs.confirmed
            this.totalDeaths += cs.deaths
            this.totalRecovered += cs.recovered
          }

        })

        this.initChart('confirmed');
      }),
      complete: () => {
        this.loading = false;
      }
    })
  }

  initChart(caseType: string) {
    console.log(caseType);

    let dataTable = [];
    dataTable.push(["Country", "Cases"]);
    this.globalData.forEach(cs => {
      let value: number = 0;

      if (caseType == 'active') {
        if (cs.active > 5000) {
          value = cs.active;
        }
      }
      if (caseType == 'confirmed') {
        if (cs.confirmed > 80000) {
          value = cs.confirmed;
        }
      }
      if (caseType == 'recovered') {
        if (cs.recovered > 50000) {
          value = cs.recovered
        }
      }
      if (caseType == 'deaths') {
        if (cs.deaths > 50000) {
          value = cs.deaths;
        }
      }

      dataTable.push([
        cs.country, value
      ])
    })
    console.log(dataTable);

    this.pieChart = {
      chartType: 'PieChart',
      dataTable: dataTable,
      //firstRowIsData: true,
      options: {
        height: 500
      },

    }
    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: dataTable,
      //firstRowIsData: true,
      options: {
        height: 500,
        animation: {
          duration: 1000,
          easing: 'out',
        }
      },

    }
  }

}
