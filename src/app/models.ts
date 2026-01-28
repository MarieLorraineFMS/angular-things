export interface Training {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
}

export interface Trainings {
    trainings: Training[];
}
