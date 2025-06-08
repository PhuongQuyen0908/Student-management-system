import { useState, useEffect } from 'react';
import { getAllClassLists } from '../services/classListService';
import { toast } from 'react-toastify';

const useClassesListPage = () => {
    const [years, setYears] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [studentCount, setStudentCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getAllClassLists();
            
            if (response.data && response.data.EC === 0) {
                const classLists = response.data.DT || [];
                console.log('Class lists:', classLists);
                
                const uniqueYears = [...new Set(classLists.map(item => 
                    item.namhoc?.TenNamHoc
                ))].filter(Boolean);
                
                const uniqueClasses = [...new Set(classLists.map(item => 
                    item.lop?.TenLop
                ))].filter(Boolean);
                
                console.log('Unique years:', uniqueYears);
                console.log('Unique classes:', uniqueClasses);
                
                setYears(uniqueYears);
                setClasses(uniqueClasses);
                
                // Set default selections
                if (uniqueYears.length > 0) setSelectedYear(uniqueYears[0]);
                if (uniqueClasses.length > 0) setSelectedClass(uniqueClasses[0]);
            } else {
                toast.error(response.data?.EM || 'Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching class lists:', error);
            toast.error('Error fetching class lists');
        } finally {
            setLoading(false);
        }
    };

    const handleYearChange = (value) => {
        setSelectedYear(value);
    };

    const handleClassChange = (value) => {
        setSelectedClass(value);
    };

    return {
        years,
        classes,
        selectedYear,
        selectedClass,
        studentCount,
        loading,
        handleYearChange,
        handleClassChange,
        setStudentCount
    };
};

export default useClassesListPage;