import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Trainings } from '../../models';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputComponent } from '../../ui/input/input.component';

@Component({
  selector: 'app-trainings',
  imports: [RouterModule, FormsModule, ButtonComponent, InputComponent],
  templateUrl: './trainings.component.html',
  styleUrl: './trainings.component.scss',
})
export class TrainingsComponent implements OnInit {
  listTrainings: Trainings | undefined;
  ngOnInit(): void {
    this.listTrainings = {
      trainings: [
        {
          id: '1',
          name: 'Angular Basics',
          description: 'Learn the basics of Angular.',
          price: 199,
          quantity: 1,
        },
        {
          id: '2',
          name: 'Advanced TypeScript',
          description: 'Deep dive into TypeScript features.',
          price: 299,
          quantity: 1,
        },
        {
          id: '3',
          name: 'Web Development',
          description: 'Comprehensive web development course.',
          price: 399,
          quantity: 1,
        },
      ],
    };
  }

  displayTrainingDetails(): void {
    this.listTrainings = {
      trainings: [
        {
          id: '1',
          name: 'Angular Basics',
          description: 'Learn the basics of Angular.',
          price: 199,
          quantity: 1,
        },
        {
          id: '2',
          name: 'Advanced TypeScript',
          description: 'Deep dive into TypeScript features.',
          price: 299,
          quantity: 1,
        },
        {
          id: '3',
          name: 'Web Development',
          description: 'Comprehensive web development course.',
          price: 399,
          quantity: 1,
        },
      ],
    };
  }

  onAddToCart(training: any): void {
    console.log(`Added to cart: ${training.name}, Quantity: ${training.quantity}`);
  }
}
