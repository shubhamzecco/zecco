"use client"

import CommonApiRequest from '@/api/rest/fetchData';
import { App_url } from '@/constant/static';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { PaymentStatus } from './components/payment-status';
import { IPaymentStatusResponse } from '@/utils/types';

const PaymentSuccess = () => {
  const { id } = useParams()
  const [paymentData, setPaymentData] = React.useState<IPaymentStatusResponse | null>(null);

  useEffect(() => {
    CommonApiRequest(
      "GET",
      `${App_url.endpoint_url?.PAYMENT_STATUS}/${id}`,
      {},
      {},
      // true,
    )?.then(async (response: any) => {

      if (response?.status === 200) {
        if (response.success) {
          // window.location.href = response.data.checkoutUrl;
          setPaymentData(response);
        }
      } else {
        console.log("error", response?.data?.message);
      }
    });
  }, [])

  return (
    <>

      <PaymentStatus
        status={paymentData?.data?.status || 'open'}
        amount={paymentData?.data?.amount || 0}
        currency={paymentData?.data?.currency || 'USD'}
        transactionId={paymentData?.data?.transaction_id || 'TXN-2024-98765432'}
        package_id={paymentData?.data?.package || 'Premium Package'}
      />
    </>
  )
}

export default PaymentSuccess