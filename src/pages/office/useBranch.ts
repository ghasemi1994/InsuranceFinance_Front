import { getBranchList } from "@/server/services/officeService";
import { BranchResponse } from "@/types/OfficeTypes";
import { useEffect, useState } from "react";


export function useBranch() {

    const [dataList, setDataList] = useState<BranchResponse[]>([]);


    const getDataList = async () => {
        await getBranchList().then((res) => {
            setDataList(res?.data);
        });
    }

    useEffect(() => {
        getDataList();
    }, [])

    const initiDataList = () => {
        getDataList();
    }

    return {
        initiDataList,

        dataList,
    }
}

