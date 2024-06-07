import { useRouter } from 'next/router';

const BlockPage = () => {
  const router = useRouter();
  const { number } = router.query;

  return (
    <div>
      <h1>Block Number: {number}</h1>
      {/* Additional block information can be displayed here */}
    </div>
  );
};

export default BlockPage;
