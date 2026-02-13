import MainLayout from '@/components/layouts/main-layout'
import PricingPlans from '../../components/section/PricingPlans'

const PackagePlan = () => {
    return (
        <MainLayout>
            <div className="-mt-8">
                <PricingPlans heading='Choose your Zecco plan' description='Unlock the full power of our AI-driven distribution network and dominate the Spanish property market.' />
            </div>
        </MainLayout>
    )
}

export default PackagePlan
