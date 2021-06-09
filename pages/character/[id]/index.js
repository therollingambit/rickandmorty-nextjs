import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from '../../../styles/character.module.css';

const defaultEndpoint = "https://rickandmortyapi.com/api/character/";

export const getServerSideProps = async ({ query }) => {
  const { id } = query;
  const res = await fetch(`${defaultEndpoint}/${id}`);
  const data = await res.json();

  return {
    props: {
      characters: data,
    },
  };
};

export default function Home({ characters }) {
  const { name, image, gender, location, origin, species, status } = characters;

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div>
        <Image src={image} height={300} width={350} />
      </div>
      <div className="flex flex-col ml-4 text-white">
        <h1 class='text-lg font-bold'>{name}</h1>
        <p className='md:py-2'>{species}</p>
        <h1 className='md:py-2'>{gender}</h1>
        <h1 className='md:py-2'><span className='font-semibold'>Current location:</span> {location.name}</h1>
        <p className='md:py-2'><span className='font-semibold'>Origin:</span> {origin.name}</p>
        <p className='md:py-2'>{status}</p>
        <div className={styles.btn}>
          <Link href="/">
            <button className='bg-gray-800 hover:bg-gray-900 text-gray-300 font-bold py-2 px-4 ml-4 rounded'>
              Back to all characters
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
