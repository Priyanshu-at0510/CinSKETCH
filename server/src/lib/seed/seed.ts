import { PrismaClient, Difficulty } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const movies = [
    {
      title: "Dilwale Dulhania Le Jayenge",
      releaseYear: 1995,
      genre: ["Drama", "Romance"],
      director: "Aditya Chopra",
      difficulty: "MEDIUM" as Difficulty
    },
    {
      title: "Hum Aapke Hain Koun..!",
      releaseYear: 1994,
      genre: ["Comedy", "Drama", "Musical"],
      director: "Sooraj R. Barjatya",
      difficulty: "EASY" as Difficulty
    },
    {
      title: "Dil To Pagal Hai",
      releaseYear: 1997,
      genre: ["Drama", "Musical", "Romance"],
      director: "Yash Chopra",
      difficulty: "EASY" as Difficulty
    },
    {
      title: "Kuch Kuch Hota Hai",
      releaseYear: 1998,
      genre: ["Comedy", "Drama", "Musical"],
      director: "Karan Johar",
      difficulty: "MEDIUM" as Difficulty
    },
    {
      title: "Lagaan",
      releaseYear: 2001,
      genre: ["Drama", "Musical", "Sport"],
      director: "Ashutosh Gowariker",
      difficulty: "HARD" as Difficulty
    },
    {
      title: "Kabhi Khushi Kabhie Gham",
      releaseYear: 2001,
      genre: ["Drama", "Musical", "Romance"],
      director: "Karan Johar",
      difficulty: "MEDIUM" as Difficulty
    },
    {
      title: "Swades",
      releaseYear: 2004,
      genre: ["Drama"],
      director: "Ashutosh Gowariker",
      difficulty: "HARD" as Difficulty
    },
    {
      title: "Taare Zameen Par",
      releaseYear: 2007,
      genre: ["Drama", "Family"],
      director: "Aamir Khan",
      difficulty: "MEDIUM" as Difficulty
    },
    {
      title: "3 Idiots",
      releaseYear: 2009,
      genre: ["Comedy", "Drama"],
      director: "Rajkumar Hirani",
      difficulty: "MEDIUM" as Difficulty
    },
    {
      title: "Gully Boy",
      releaseYear: 2019,
      genre: ["Drama", "Music"],
      director: "Zoya Akhtar",
      difficulty: "EASY" as Difficulty
    },
    {
      title: "Dangal",
      releaseYear: 2016,
      genre: ["Action", "Biography", "Drama"],
      director: "Nitesh Tiwari",
      difficulty: "HARD" as Difficulty
    },
    {
      title: "Bajrangi Bhaijaan",
      releaseYear: 2015,
      genre: ["Adventure", "Comedy", "Drama"],
      director: "Kabir Khan",
      difficulty: "EASY" as Difficulty
    },
    {
      title: "PK",
      releaseYear: 2014,
      genre: ["Comedy", "Drama", "Fantasy"],
      director: "Rajkumar Hirani",
      difficulty: "MEDIUM" as Difficulty
    },
    {
      title: "Queen",
      releaseYear: 2013,
      genre: ["Adventure", "Comedy", "Drama"],
      director: "Vikas Bahl",
      difficulty: "EASY" as Difficulty
    },
    {
      title: "Barfi!",
      releaseYear: 2012,
      genre: ["Comedy", "Drama", "Romance"],
      director: "Anurag Basu",
      difficulty: "MEDIUM" as Difficulty
    },
    {
      title: "Dear Zindagi",
      releaseYear: 2016,
      genre: ["Drama", "Romance"],
      director: "Gauri Shinde",
      difficulty: "EASY" as Difficulty
    },
    {
      title: "Zindagi Na Milegi Dobara",
      releaseYear: 2011,
      genre: ["Adventure", "Comedy", "Drama"],
      director: "Zoya Akhtar",
      difficulty: "MEDIUM" as Difficulty
    },
    {
      title: "Yeh Jawaani Hai Deewani",
      releaseYear: 2013,
      genre: ["Comedy", "Drama", "Romance"],
      director: "Ayan Mukherjee",
      difficulty: "EASY" as Difficulty
    },
    {
      title: "Highway",
      releaseYear: 2014,
      genre: ["Adventure", "Drama", "Romance"],
      director: "Imtiaz Ali",
      difficulty: "HARD" as Difficulty
    },
    {
      title: "Pink",
      releaseYear: 2016,
      genre: ["Drama", "Thriller"],
      director: "Aniruddha Roy Chowdhury",
      difficulty: "MEDIUM" as Difficulty
    },
    {
      title: "Badhaai Ho",
      releaseYear: 2018,
      genre: ["Comedy", "Drama", "Family"],
      director: "Amit Ravindernath Sharma",
      difficulty: "EASY" as Difficulty
    },
    {
      title: "Stree",
      releaseYear: 2018,
      genre: ["Comedy", "Horror"],
      director: "Amar Kaushik",
      difficulty: "EASY" as Difficulty
    },
    {
      title: "Article 15",
      releaseYear: 2019,
      genre: ["Crime", "Drama"],
      director: "Anubhav Sinha",
      difficulty: "HARD" as Difficulty
    },
    {
      title: "Andhadhun",
      releaseYear: 2018,
      genre: ["Comedy", "Crime", "Thriller"],
      director: "Sriram Raghavan",
      difficulty: "MEDIUM" as Difficulty
    },
    {
      title: "Gangs of Wasseypur",
      releaseYear: 2012,
      genre: ["Action", "Comedy", "Crime"],
      director: "Anurag Kashyap",
      difficulty: "HARD" as Difficulty
    },
    {
      title: "The Lunchbox",
      releaseYear: 2013,
      genre: ["Drama", "Romance"],
      director: "Ritesh Batra",
      difficulty: "MEDIUM" as Difficulty
    },
    {
      title: "Padmaavat",
      releaseYear: 2018,
      genre: ["Drama", "History", "Romance"],
      director: "Sanjay Leela Bhansali",
      difficulty: "HARD" as Difficulty
    },
    {
      title: "Raazi",
      releaseYear: 2018,
      genre: ["Action", "Drama", "Thriller"],
      director: "Meghna Gulzar",
      difficulty: "MEDIUM" as Difficulty
    },
    {
      title: "Tumbbad",
      releaseYear: 2018,
      genre: ["Drama", "Fantasy", "Horror"],
      director: "Rahi Anil Barve",
      difficulty: "HARD" as Difficulty
    },
    {
      title: "Chhichhore",
      releaseYear: 2019,
      genre: ["Comedy", "Drama"],
      director: "Nitesh Tiwari",
      difficulty: "EASY" as Difficulty
    },
    {
      title: "Simmba",
      releaseYear: 2018,
      genre: ["Action", "Comedy", "Crime"],
      director: "Rohit Shetty",
      difficulty: "EASY" as Difficulty
    },
    {
      title: "Kabir Singh",
      releaseYear: 2019,
      genre: ["Action", "Drama", "Romance"],
      director: "Sandeep Reddy Vanga",
      difficulty: "MEDIUM" as Difficulty
    },
    {
      title: "Bajirao Mastani",
      releaseYear: 2015,
      genre: ["Action", "Drama", "History"],
      director: "Sanjay Leela Bhansali",
      difficulty: "HARD" as Difficulty
    },
    {
      title: "Dil Chahta Hai",
      releaseYear: 2001,
      genre: ["Comedy", "Drama", "Romance"],
      director: "Farhan Akhtar",
      difficulty: "MEDIUM" as Difficulty
    },
    {
      title: "Rockstar",
      releaseYear: 2011,
      genre: ["Drama", "Music", "Musical"],
      director: "Imtiaz Ali",
      difficulty: "MEDIUM" as Difficulty
    },
    {
      title: "Piku",
      releaseYear: 2015,
      genre: ["Comedy", "Drama"],
      director: "Shoojit Sircar",
      difficulty: "EASY" as Difficulty
    },
    {
      title: "Kahaani",
      releaseYear: 2012,
      genre: ["Mystery", "Thriller"],
      director: "Sujoy Ghosh",
      difficulty: "MEDIUM" as Difficulty
    },
    {
      title: "Uri: The Surgical Strike",
      releaseYear: 2019,
      genre: ["Action", "Drama", "War"],
      director: "Aditya Dhar",
      difficulty: "HARD" as Difficulty
    },
    {
      title: "Masaan",
      releaseYear: 2015,
      genre: ["Drama"],
      director: "Neeraj Ghaywan",
      difficulty: "MEDIUM" as Difficulty
    },
    {
      title: "Udaan",
      releaseYear: 2010,
      genre: ["Drama"],
      director: "Vikramaditya Motwane",
      difficulty: "MEDIUM" as Difficulty
    },
    {
      title: "Airlift",
      releaseYear: 2016,
      genre: ["Action", "Drama", "History"],
      director: "Raja Menon",
      difficulty: "MEDIUM" as Difficulty
    },
    {
      title: "Newton",
      releaseYear: 2017,
      genre: ["Drama"],
      director: "Amit V. Masurkar",
      difficulty: "HARD" as Difficulty
    }
  ];

  for (const movie of movies) {
    await prisma.movie.create({
      data: {
        title: movie.title,
        releaseYear: movie.releaseYear,
        genre: movie.genre,
        director: movie.director as string,
        difficulty: movie.difficulty
      }
    });
  }

  console.log('Seed data inserted successfully.');
}

main()
  .catch(async(e) => {
    console.error('An error occurred:', e)
    await prisma.$disconnect()
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
