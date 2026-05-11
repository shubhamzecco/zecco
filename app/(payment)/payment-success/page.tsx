import CommonApiRequest from '@/api/rest/fetchData';
import { App_url } from '@/constant/static';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'

const PaymentSuccess = () => {
  const { id } = useParams()

  useEffect(() => {
    CommonApiRequest(
      "GET",
      `${App_url.endpoint_url?.PAYMENT_STATUS}/${id}`,
      {},
      {},
      // true,
    )?.then(async (response: any) => {
      console.log("response-payment-status", response);

      if (response?.status === 200) {
        if (response.success) {
          window.location.href = response.data.checkoutUrl;
        }
      } else {
        console.log("error", response?.data?.message);
      }
    });
  }, [])

  return (
    <div>PaymentSuccess</div>
  )
}

export default PaymentSuccess