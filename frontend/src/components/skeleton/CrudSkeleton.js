import React from 'react'
import ContentLoader from 'react-content-loader'

const CrudSkeleton = props => (
  <ContentLoader
    speed={2}
    height={400}
    backgroundColor="var(--secondary-bg-color)"
    foregroundColor="var(--grey-color)"
    {...props}
  >
    <rect x="27" y="139" rx="4" ry="4" width="20" height="20" />
    <rect x="67" y="140" rx="10" ry="10" width="85" height="19" />
    <rect x="188" y="141" rx="10" ry="10" width="169" height="19" />
    <rect x="402" y="140" rx="10" ry="10" width="85" height="19" />
    <rect x="523" y="141" rx="10" ry="10" width="169" height="19" />
    <rect x="731" y="139" rx="10" ry="10" width="85" height="19" />
    <rect x="852" y="138" rx="10" ry="10" width="85" height="19" />
    
    <rect x="26" y="196" rx="4" ry="4" width="20" height="20" />
    <rect x="66" y="197" rx="10" ry="10" width="85" height="19" />
    <rect x="187" y="198" rx="10" ry="10" width="169" height="19" />
    <rect x="401" y="197" rx="10" ry="10" width="85" height="19" />
    <rect x="522" y="198" rx="10" ry="10" width="169" height="19" />
    <rect x="730" y="196" rx="10" ry="10" width="85" height="19" />
    <rect x="851" y="195" rx="10" ry="10" width="85" height="19" />

    <rect x="26" y="258" rx="4" ry="4" width="20" height="20" />
    <rect x="66" y="259" rx="10" ry="10" width="85" height="19" />
    <rect x="187" y="260" rx="10" ry="10" width="169" height="19" />
    <rect x="401" y="259" rx="10" ry="10" width="85" height="19" />
    <rect x="522" y="260" rx="10" ry="10" width="169" height="19" />
    <rect x="730" y="258" rx="10" ry="10" width="85" height="19" />
    <rect x="851" y="257" rx="10" ry="10" width="85" height="19" />
  </ContentLoader>
)

export default CrudSkeleton