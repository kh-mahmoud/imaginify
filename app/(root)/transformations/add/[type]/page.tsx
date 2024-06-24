import Header from '@/components/shared/Header';
import TransformationForm from '@/components/shared/TransformationForm';
import { transformationTypes} from '@/constants';
import { getUserById } from '@/lib/actions/user.actions';
import { SearchParamProps, TransformationTypeKey } from '@/types';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const AddTransformation = async({params:{type}}:SearchParamProps) => {
  
  const {userId} = auth()
   
  if(!userId) redirect('/')
 
  const user= await getUserById(userId)

  if(!user) redirect('/')

  const transformation = transformationTypes[type]; 

  return (
    <div >
        <Header title={transformation.title} subTitle={transformation.subTitle}/>
        <TransformationForm userId={user?.id} creditBalance={user.creditBalance}  type={transformation.type as TransformationTypeKey} action='Add'/>
    </div>
  );
}

export default AddTransformation;
