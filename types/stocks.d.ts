declare global {
  type Dividends = {
    id: number;
    companyshortname: string;
    co_name: string;
    co_code: string;
    sectorname: string;
    symbol: string;
    purpose: string;
    isin: string;
    announcementdate: string;
    dividend_date: string;
    record_date: string | null;
    bcstartdate: string | null;
    bcenddate: string | null;
    dividend_amount: string;
    dividend_percentage: string;
    remark: string;
    description: string;
    facevalue: string;
  };
}

export {};
