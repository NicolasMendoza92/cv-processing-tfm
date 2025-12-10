
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws'; 
import { PrismaClient } from '@/generated/prisma/client';

// Configuración de WebSocket para Neon (necesario en algunos entornos, especialmente Vercel Edge)
neonConfig.webSocketConstructor = ws;

const connectionString = `${process.env.DATABASE_URL}`

// Init prisma client
const adapter = new PrismaNeon({ connectionString })

// Declara la variable global para PrismaClient para manejar el hot-reloading en desarrollo
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export { prisma }; 


// import { neon } from '@neondatabase/serverless';

// if (!process.env.DATABASE_URL) {
//   throw new Error("DATABASE_URL environment variable is required");
// }

// const sql = neon(process.env.DATABASE_URL);


// async function getData() {

//   const response = await sql`SELECT version()`;
//   return response[0].version;
// }
// export default async function Page() {
//   const data = await getData();
//   return data;
// }