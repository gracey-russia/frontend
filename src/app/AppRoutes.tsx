import { Route, Routes } from 'react-router-dom';
import { ApplicationCreate } from '../pages/ApplicationCreate';
import { CustomerInfoPage } from '../pages/CustomerInfo';
import { DefaultPage } from '../pages/DefaultPage';
import {LoginPage} from '../pages/Login'
import { CustomerPage } from '../pages/Customer';
import { NurseInfoPage } from '../pages/NurseInfo';
import { SMSPage } from '../pages/Sms';
import { MainPage } from '../pages/Main';
import { ApplicationPage } from '../pages/ApplicationPage';
import { OrderPage } from '../pages/OrderPage';
import { NursePage } from '../pages/NursePage';
import { VisitPage } from '../pages/VisitPage';
import { AppelationCreatePage } from '../pages/AppelationCreate';
import { AppelationPage } from '../pages/Appelation';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={'auth/login'} element={<LoginPage />} />
      <Route path={'auth/sms'} element={<SMSPage />} />
      <Route element={<DefaultPage />}>
        <Route path='/' element={<MainPage/>}></Route>
        <Route path='nurse/' element={<NursePage></NursePage>}>
          <Route path='order/:order_id' element={<OrderPage/>}/>
          <Route path='visit/:visit_id' element={<VisitPage/>}></Route>
        </Route>
        <Route path='customer' element={<CustomerPage/>}>
          <Route path='application/:application_id' element={<ApplicationPage/>}/>
          <Route path='order/:order_id' element={<OrderPage/>}/>
          <Route path='visit/:visit_id' element={<VisitPage/>}></Route>
          <Route path='appelation/create/:visit_id' element={<AppelationCreatePage/>}></Route>
          <Route path='appelation/:appelation_id' element={<AppelationPage/>}></Route>

        </Route>
        <Route path='customer/application/create' element={<ApplicationCreate/>}></Route>
        <Route path='customer/customer_form' element={<CustomerInfoPage/>} />
        <Route path='nurse/nurse_form' element={<NurseInfoPage/>} />

        {/* <Route path={'auth/nurse-info'} element={<ResponsePage />} />
        <Route path={'auth/customer-info'} element={<TextPage />} />
        <Route path={'auth/customer-info'} element={<TextPage />} /> */}

      </Route>
    </Routes>
  );
};