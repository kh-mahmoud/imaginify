import { Collection } from "@/components/shared/Collection";
import { navLinks } from "@/constants";
import { getAllImages } from "@/lib/actions/image.actions";
import { SearchParamProps } from "@/types";
import Image from "next/image";
import Link from "next/link";



const Home = async ({ searchParams }: SearchParamProps) => {

  const page = Number(searchParams?.page) || 1
  const searchQuery = (searchParams?.query as string) || ''

  const images = await getAllImages({ page, searchQuery })

  return (
    <div>
      <section className="home">
        <h1 className="home-heading">
          Unleash Your Creative Vision with Imaginify
        </h1>
        <ul className="gap-20 flex-center w-full">

          {navLinks.slice(1, 5).map((link) =>
          (
            <Link key={link.route} href={link.route} className="flex-center flex-col gap-2">
              <li className="flex-center rounded-full w-fit p-4 bg-white">
                <Image
                  src={link.icon}
                  height={24}
                  width={24}
                  alt="image" />
              </li>
              <p className="p-14-medium text-center text-white">{link.label}</p>

            </Link>
          ))}
        </ul>
      </section>

      <section className="sm:mt-12">
        <Collection
          hasSearch={true}
          images={images.data}
          totalPages={images.totalPage}
          page={page}
        />
      </section>


    </div>
  );
}

export default Home;
