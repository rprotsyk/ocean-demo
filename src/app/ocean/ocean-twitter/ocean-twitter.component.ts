import { Component, OnInit } from '@angular/core';
import { OceanService } from '../ocean.service';
import { OceanStoreService } from '../ocean.store';
import { Color } from 'ng2-charts';
import { Profile } from '../ocean-profile/ocean-profile.component';

@Component({
  selector: 'app-ocean-twitter',
  templateUrl: './ocean-twitter.component.html',
  styleUrls: ['./ocean-twitter.component.css']
})
export class OceanTwitterComponent implements OnInit {
  // Radar
  public radarChartLabels: string[] = ['Openness', 'Conscientiousness',
    'Extraversion', 'Agreeableness', 'Neuroticism'];

  public message = 'Here you’ll see your OCEAN scores';
  public messageHint = '';
  public messageImage = 'try-empty';
  public radarChartData: any = [
    {
      data: [], label: '', borderWidth: '8',
      pointStyle: 'circle'
    }
  ];
  public radarChartType = 'radar';
  public loading = false;
  public profile: Profile;
  public oceanAdvertBackground = '';
  public twitterName = '';
  public chartColors: Array<Color> = [{
    borderColor: '#d51b5d',
    backgroundColor: 'transparent',
  }];

  public chartOptions = {
    scale: {
      pointLabels: {
        fontSize: 14,
        fontFamily: 'Open Sans'
      }
    },
    legend: {
      display: false
    }
  };

  constructor(
    private oceanService: OceanService,
    private oceanStore: OceanStoreService
  ) { }

  ngOnInit() {
  }

  public getOcean() {
    this.loading = true;
    this.oceanAdvertBackground = '';
    this.oceanService.getOcean(this.twitterName)
      .subscribe((profile: Profile) => {
        this.profile = profile;
        if (profile.scores.length > 0) {
          this.radarChartData[0].data = [profile.scores[0].percentile,
            profile.scores[1].percentile,
            profile.scores[2].percentile,
            profile.scores[3].percentile,
            profile.scores[4].percentile] ;
          const img = profile.prof[0].replace(' ', '');
          this.oceanAdvertBackground = `/assets/img/asd/${img}.jpg`;
          this.message = '';
          this.messageHint = '';
          this.messageImage = '';
        } else {
          if (profile.status[0] === 'User is not found') {
            this.message = 'Hmmm... we could not find account with such name';
            this.messageHint = 'Please verify Twitter handle or try another one';
            this.messageImage = 'try-no-account';
          }
          if (profile.status[0] === 'Not enought data to extract OCEAN' ||
              profile.status[0] === 'Provided user has no self-written tweets') {
            this.message = 'It seems there is not enough data to analyze the profile.';
            this.messageHint = 'We could try checking another account';
            this.messageImage = 'try-not-enough-info';
          }
        }
        this.loading = false;
      },
      error => {
        this.loading = false;
        if ((<any>error).statusText === 'Unknown Error') {
            this.message = 'Ooops.. It seems something went wrong.';
            this.messageHint = 'Re-send your request';
            this.messageImage = 'try-error';
        }
      });
  }
}
