import Image from "next/image";
import { FormEvent, useRef } from "react";
import appPreviewImg from "../assets/app-nlw-copa-preview.png";
import iconCheckImg from "../assets/icon-check.svg";
import logoImg from "../assets/logo.svg";
import usersAvatarImg from "../assets/users-avatar-example.png";
import { Backend } from "../services";
import { ApiRoutes } from "../utils/apiRoutes";

interface HomeProps {
  poolsCount: number;
  guessesCount: number;
  usersCountData: number;
}

const Home: React.FC<HomeProps> = ({
  poolsCount,
  guessesCount,
  usersCountData,
}) => {
  const createPoolRef = useRef<HTMLInputElement>(null);
  const createPool = async (ev: FormEvent) => {
    ev.preventDefault();
    try {
      const response = await Backend.post(ApiRoutes.POOL.CREATE, {
        title: createPoolRef.current?.value,
      });
      const { code } = response.data;
      await navigator.clipboard.writeText(code);
      alert("Bolão criado com sucesso. Código copiado!");

      if (createPoolRef.current) createPoolRef.current.value = "";
    } catch (err) {
      console.log(err);
      alert("Falha ao criar bolão, tente novamente");
    }
  };

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImg} alt="NLW Copa" quality={100} />
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image
            src={usersAvatarImg}
            alt="Avatares de Usuários"
            quality={100}
          />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{usersCountData}</span> pessoas
            já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-white"
            type="text"
            ref={createPoolRef}
            required
            placeholder="Qual nome do seu bolão"
          />
          <button
            className="bg-yellow-500 px-6 py-4 hover:bg-yellow-700 rounded font-bold text-gray-900 font-sm uppercase"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" quality={100} />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{poolsCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-14 bg-gray-600" />
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" quality={100} />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{guessesCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image
        src={appPreviewImg}
        alt="Dois celulares exibindo uma prévia da aplicação"
        quality={100}
      />
    </div>
  );
};

export default Home;

export const getStaticProps = async () => {
  const [poolCountData, guessCountData, userCountData] = await Promise.all([
    Backend.get(ApiRoutes.POOL.COUNT),
    Backend.get(ApiRoutes.GUESS.COUNT),
    Backend.get(ApiRoutes.USER.COUNT),
  ]);

  return {
    props: {
      guessesCount: guessCountData.data.count,
      poolsCount: poolCountData.data.count,
      usersCountData: userCountData.data.count,
    },
  };
};
