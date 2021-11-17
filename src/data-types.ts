export interface Director {
    name: string,
    bio: string,
    birth_year: string,
    death_year: string
}

export interface Genre {
    name: string,
    description: string
}

export interface Movie {
    title: string,
    director: Array<Director>,
    genre: Array<Genre>,
    actors: Array<string>,
    _id: string
}

export interface User {
  _id: string,
  user_name: string,
  password: string,
  email: string,
  birth_date: string
}