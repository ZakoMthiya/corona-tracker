import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GloabalDataSummary } from 'src/app/models/global-data';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  data: GloabalDataSummary[];
  countries: string[] = [];

  constructor(private dataService: DataServiceService) { }

  ngOnInit() {
    this.dataService.getGlobalData().subscribe(result => {
      this.data = result;
      this.data.forEach(cs => {
        this.countries.push(cs.country);
      })
    })
  }

  updateValues(country: string) {
    console.log(country);
    this.data.forEach(cs => {
      if(cs.country == country) {
        this.totalActive = cs.active
        this.totalConfirmed = cs.confirmed
        this.totalDeaths = cs.deaths
        this.totalRecovered = cs.recovered
      }
    })
  }
}
