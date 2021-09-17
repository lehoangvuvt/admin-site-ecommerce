import { FC, useEffect, useState } from "react";
import { formatter as currencyFormatter } from '../../../utils/currency.formatter';
import axios from "axios";
import Chart from "react-apexcharts";
import LoadingBar from "../../../components/LoadingBar";
import moment from "moment";

type DataType = {
    Name: string,
    Sales: number,
    Conversions: number,
}

const Dashboard = () => {
    const [percentageDownloaded, setPercentageDownloaded] = useState(0);
    const [totalProductAmount, setTotalProductAmount] = useState(0);
    const [totalCategoryAmount, setTotalCategoryAmount] = useState(0);
    const [revenueInMonth, setRevenueInMonth] = useState(0);
    const [revenueAllTime, setRevenueAllTime] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [avgOrderValueLastWeek, setAvgOrderValueLastWeek] = useState(0);
    const [avgOrderValueThisWeek, setAvgOrderValueThisWeek] = useState(0);
    const [salesFilter, setSalesFilter] = useState('tyear');
    const [isLoadingSales, setLoadingSales] = useState(false);
    const [series, setSeries] = useState<Array<{ name: string, data: Array<{ x: number, y: number }> }>>([]);
    const colors = ['#3498DB', '#2ECC71', '#FF0084'];
    const currentDT = new Date();
    const [options, setOptions] = useState<ApexCharts.ApexOptions>(
        {
            chart: {
                type: 'area',

                stacked: false,
                zoom: {
                    enabled: false,
                },
                events: {
                    markerClick: function (event, chartContext, { seriesIndex, dataPointIndex, config }) {
                        console.log(chartContext.data.twoDSeriesX[dataPointIndex]);
                    }
                }
            },
            grid: {
                row: {
                    colors: ['transparent', 'transparent'],
                    opacity: 0.5
                },
                column: {
                    colors: ['#f8f8f8', 'transparent'],
                },
                xaxis: {
                    lines: {
                        show: false
                    }
                },
                yaxis: {
                    lines: {
                        show: true,
                    }
                }
            },
            dataLabels: {
                enabled: false,

            },
            markers: {
                size: 5,
                colors,
                strokeWidth: 2,
                hover: {
                    size: 8,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: false,
                    opacityFrom: 0.5,
                    opacityTo: 0.5,
                    stops: [20, 100, 100, 100]
                },
            },
            stroke: {
                curve: 'smooth',
                width: 3,
                colors,
            },
            yaxis: {
                labels: {
                    style: {
                        colors: '#8e8da4',
                        fontSize: '12px',
                        fontFamily: 'Roboto',
                    },
                    offsetX: 0,
                    formatter: function (val: number) {
                        if (val) {
                            return val.toString();
                        } else {
                            return '0';
                        }
                    },
                },
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false
                }
            },
            xaxis: {
                type: 'datetime',
                tickAmount: 'dataPoints',
                sorted: true,
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    hideOverlappingLabels: false,
                    style: {
                        fontSize: '12px',
                        fontFamily: 'Roboto',
                    },
                    rotateAlways: false,
                    formatter: function (val: string, timestamp: number) {
                        return moment(timestamp).locale('vi').format('MMM');
                    }
                }
            },
            title: {
                text: 'Sales statistics',
                style: {
                    fontFamily: 'Ubuntu',
                    fontSize: '18px',
                },
                align: 'left',
                offsetX: 14
            },
            tooltip: {
                shared: true,
                style: {
                    fontFamily: 'Roboto',
                },
                theme: 'light'
            },
            legend: {
                fontFamily: 'Roboto',
                show: true,
                position: 'top',
                horizontalAlign: 'center',
                fontSize: '14px',
                offsetX: -10,
                labels: {
                    colors,
                },
                markers: {
                    fillColors: colors,
                },
            },
        });

    const getDashboardReports = async () => {
        const response = await axios({
            url: "http://localhost:5035/admin/reports/dashboard",
            method: 'GET',
            withCredentials: true,
            onDownloadProgress: (progressEvent: ProgressEvent) => {
                const percentageDownloaded = Math.round(progressEvent.loaded * 100 / progressEvent.total);
                setPercentageDownloaded(percentageDownloaded);
            }
        })
        const data = response.data;
        setTotalProductAmount(data.totalProductAmount);
        setTotalCategoryAmount(data.totalCategoryAmount);
        setRevenueInMonth(data.revenueInMonth);
        setRevenueAllTime(data.revenueAllTime);
        setTotalOrders(data.totalOrders);
        setAvgOrderValueLastWeek(data.avgOrderValueLastWeek);
        setAvgOrderValueThisWeek(data.avgOrderValueThisWeek);
    }

    const getSalesStatistics = async () => {
        setLoadingSales(true);
        const response = await axios({
            url: `http://localhost:5035/admin/reports/sales-statistics?mode=${salesFilter}`,
            method: 'GET',
            withCredentials: true,
            onDownloadProgress: (progressEvent: ProgressEvent) => {
                const percentageDownloaded = Math.round(progressEvent.loaded * 100 / progressEvent.total);

            }
        })
        const data = response.data;
        let sales: Array<{ timestamp: number, totalOrders: number, totalQty: number }> = [];
        let salesData: Array<{ name: string, data: Array<{ x: number, y: number }> }> = [
            {
                name: 'Sales',
                data: []
            },
            {
                name: 'Quantity',
                data: []
            }
        ];
        sales = data.sales;
        const getSalesStatistics = sales.map(sale => {
            salesData[0].data.push({ x: sale.timestamp, y: sale.totalOrders });
            salesData[1].data.push({ x: sale.timestamp, y: sale.totalQty });
        });
        await Promise.all(getSalesStatistics);
        setSeries(salesData);
        setLoadingSales(false);
    }

    useEffect(() => {
        getDashboardReports();
    }, [])

    useEffect(() => {
        getSalesStatistics();
    }, [salesFilter])

    const setXAxisFormat = (formatString: string) => {
        setOptions({
            ...options,
            xaxis: {
                type: 'datetime',
                tickAmount: 'dataPoints',
                sorted: true,
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    hideOverlappingLabels: false,
                    style: {
                        fontSize: '12px',
                        fontFamily: 'Roboto',
                    },
                    rotateAlways: false,
                    formatter: function (val: string, timestamp: number) {
                        return moment(timestamp).format(formatString);
                    }
                }
            }
        })
    }

    return (
        <div className='dashboard-container'>
            <LoadingBar percentCompleted={percentageDownloaded} />
            <div className='dashboard-container__scoreboards'>
                <div className='dashboard-container__scoreboards__scoreboard'>
                    <div className='dashboard-container__scoreboards__scoreboard__left'>
                        <img src='https://image.flaticon.com/icons/png/512/550/550638.png' />
                    </div>
                    <div className='dashboard-container__scoreboards__scoreboard__right'>
                        <div className='dashboard-container__scoreboards__scoreboard__right__title'>
                            <h1>Revenue</h1>
                        </div>
                        <div className='dashboard-container__scoreboards__scoreboard__right__value'>
                            <h1>{currencyFormatter(revenueAllTime)}</h1>
                        </div>
                        <div className='dashboard-container__scoreboards__scoreboard__right__info'>
                            <p>Shipping fees are not included</p>
                        </div>
                    </div>
                </div>

                <div className='dashboard-container__scoreboards__scoreboard'>
                    <div className='dashboard-container__scoreboards__scoreboard__left'>
                        <img src='https://image.flaticon.com/icons/png/512/1007/1007908.png' />
                    </div>
                    <div className='dashboard-container__scoreboards__scoreboard__right'>
                        <div className='dashboard-container__scoreboards__scoreboard__right__title'>
                            <h1>Orders</h1>
                        </div>
                        <div className='dashboard-container__scoreboards__scoreboard__right__value'>
                            <h1>{totalOrders}</h1>
                        </div>
                        <div className='dashboard-container__scoreboards__scoreboard__right__info'>
                            <p>Excluding orders in transit</p>
                        </div>
                    </div>
                </div>

                <div className='dashboard-container__scoreboards__scoreboard'>
                    <div className='dashboard-container__scoreboards__scoreboard__left'>
                        <img src='https://image.flaticon.com/icons/png/512/3703/3703249.png' />
                    </div>
                    <div className='dashboard-container__scoreboards__scoreboard__right'>
                        <div className='dashboard-container__scoreboards__scoreboard__right__title'>
                            <h1>Products</h1>
                        </div>
                        <div className='dashboard-container__scoreboards__scoreboard__right__value'>
                            <h1>{totalProductAmount}</h1>
                        </div>
                        <div className='dashboard-container__scoreboards__scoreboard__right__info'>
                            <p>In {totalCategoryAmount} Categories</p>
                        </div>
                    </div>
                </div>

                <div className='dashboard-container__scoreboards__scoreboard'>
                    <div className='dashboard-container__scoreboards__scoreboard__left'>
                        <img src='https://image.flaticon.com/icons/png/512/3889/3889734.png' />
                    </div>
                    <div className='dashboard-container__scoreboards__scoreboard__right'>
                        <div className='dashboard-container__scoreboards__scoreboard__right__title'>
                            <h1>Monthly Earning</h1>
                        </div>
                        <div className='dashboard-container__scoreboards__scoreboard__right__value'>
                            <h1>{currencyFormatter(revenueInMonth)}</h1>
                        </div>
                        <div className='dashboard-container__scoreboards__scoreboard__right__info'>
                            <p>Base in your local time</p>
                        </div>
                    </div>
                </div>

                <div className='dashboard-container__scoreboards__scoreboard-big'>
                    <div className='dashboard-container__scoreboards__scoreboard-big__left'>
                        <div className='dashboard-container__scoreboards__scoreboard-big__left__value'>
                            <h1>{currencyFormatter(avgOrderValueThisWeek)}</h1>
                        </div>
                        <div className='dashboard-container__scoreboards__scoreboard-big__left__title'>
                            <h1>Avg. order value</h1>
                        </div>
                        <div className='dashboard-container__scoreboards__scoreboard-big__left__info'>
                            {avgOrderValueThisWeek >= avgOrderValueLastWeek ?
                                <i style={{ color: '#2ECC71' }} className="fas fa-arrow-up"></i> :
                                <i style={{ color: '#E74C3C' }} className="fas fa-arrow-down"></i>
                            }
                            <p>{avgOrderValueThisWeek >= avgOrderValueLastWeek ?
                                <span style={{ color: '#2ECC71' }}>{Math.round((avgOrderValueThisWeek - avgOrderValueLastWeek) / avgOrderValueLastWeek * 100) + '%'}</span>
                                :
                                <span style={{ color: '#E74C3C' }}>{Math.round((avgOrderValueLastWeek - avgOrderValueThisWeek) / avgOrderValueLastWeek * 100) + '%'}</span>}
                                &nbsp;&nbsp;Since last week
                            </p>
                        </div>
                    </div>
                    <div className='dashboard-container__scoreboards__scoreboard-big__right'>
                        <img src="https://image.flaticon.com/icons/png/512/1260/1260398.png" />
                    </div>
                </div>

                <div className='dashboard-container__scoreboards__scoreboard-big'>
                    <div className='dashboard-container__scoreboards__scoreboard-big__left'>
                        <div className='dashboard-container__scoreboards__scoreboard-big__left__value'>
                            <h1>{currencyFormatter(avgOrderValueThisWeek)}</h1>
                        </div>
                        <div className='dashboard-container__scoreboards__scoreboard-big__left__title'>
                            <h1>Unique visitors</h1>
                        </div>
                        <div className='dashboard-container__scoreboards__scoreboard-big__left__info'>
                            {avgOrderValueThisWeek >= avgOrderValueLastWeek ?
                                <i style={{ color: '#2ECC71' }} className="fas fa-arrow-up"></i> :
                                <i style={{ color: '#E74C3C' }} className="fas fa-arrow-down"></i>
                            }
                            <p>{avgOrderValueThisWeek >= avgOrderValueLastWeek ?
                                <span style={{ color: '#2ECC71' }}>{Math.round((avgOrderValueThisWeek - avgOrderValueLastWeek) / avgOrderValueLastWeek * 100) + '%'}</span>
                                :
                                <span style={{ color: '#E74C3C' }}>{Math.round((avgOrderValueLastWeek - avgOrderValueThisWeek) / avgOrderValueLastWeek * 100) + '%'}</span>}
                                &nbsp;&nbsp;Since last week
                            </p>
                        </div>
                    </div>
                    <div className='dashboard-container__scoreboards__scoreboard-big__right'>
                        <img src="https://image.flaticon.com/icons/png/512/1260/1260398.png" />
                    </div>
                </div>
            </div>
            <div className='sales-static-chart'>
                <div className='sales-static-chart__options'>
                    <div
                        onClick={() => {
                            setXAxisFormat('MMM')
                            setSalesFilter('tyear');
                        }}
                        className={salesFilter === 'tyear' ? 'sales-static-chart__options__option sales-static-chart__options__option--active' : 'sales-static-chart__options__option'}>
                        <h1>This year</h1>
                    </div>
                    <div
                        onClick={() => {
                            setXAxisFormat('MMM')
                            setSalesFilter('lyear');
                        }}
                        className={salesFilter === 'lyear' ? 'sales-static-chart__options__option sales-static-chart__options__option--active' : 'sales-static-chart__options__option'}>
                        <h1>Last year</h1>
                    </div>
                    <div
                        onClick={() => {
                            setXAxisFormat('DD/MM')
                            setSalesFilter('tmonth');
                        }}
                        className={salesFilter === 'tmonth' ? 'sales-static-chart__options__option sales-static-chart__options__option--active' : 'sales-static-chart__options__option'}>
                        <h1>This month</h1>
                    </div>
                    <div
                        onClick={() => {
                            setXAxisFormat('DD/MM')
                            setSalesFilter('lmonth');
                        }}
                        className={salesFilter === 'lmonth' ? 'sales-static-chart__options__option sales-static-chart__options__option--active' : 'sales-static-chart__options__option'}>
                        <h1>Last month</h1>
                    </div>
                    <div
                        onClick={() => {
                            setXAxisFormat('dd DD MMM')
                            setSalesFilter('tweek');
                        }}
                        className={salesFilter === 'tweek' ? 'sales-static-chart__options__option sales-static-chart__options__option--active' : 'sales-static-chart__options__option'}>
                        <h1>This week</h1>
                    </div>
                    <div
                        onClick={() => {
                            setXAxisFormat('dd DD MMM')
                            setSalesFilter('lweek');
                        }}
                        className={salesFilter === 'lweek' ? 'sales-static-chart__options__option sales-static-chart__options__option--active' : 'sales-static-chart__options__option'}>
                        <h1>Last week</h1>
                    </div>
                    <div
                        onClick={() => {
                            setXAxisFormat('HH:00')
                            setSalesFilter('today');
                        }}
                        className={salesFilter === 'today' ? 'sales-static-chart__options__option sales-static-chart__options__option--active' : 'sales-static-chart__options__option'}>
                        <h1>Today</h1>
                    </div>
                </div>

                {
                    !isLoadingSales ?
                        series.length > 0 ?
                            <Chart
                                className='chart'
                                options={options}
                                series={series}
                                height="80%"
                                width='100%'
                                type="area" />
                            : null
                        : null
                }
            </div>
        </div >
    )
}

export default Dashboard;