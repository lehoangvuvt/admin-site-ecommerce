import { FC, useEffect, useState } from "react";
import { BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar } from "recharts";
import './style.scss';

type BarPropsType = {
    data: Array<any>,
    field1: string,
    field2: string,
}

const CustomTooltip = ({ active, payload, label }: any) => {

    if (active) {
        return (
            <div className="custom-tootltip">
                <div className="custom-tootltip__field">
                    <h1>{payload[0].payload.Name}</h1>
                </div>
                <div className="custom-tootltip__field">
                    <h1>Sales:</h1>&nbsp;<h1>{payload[0].payload.Sales}</h1>
                </div>
                <div className="custom-tootltip__field">
                    <h1>Conversions:</h1>&nbsp;<h1>{payload[0].payload.Conversions}</h1>
                </div>
            </div>
        );
    }
    return null;
}

const Bar1: FC<BarPropsType> = ({ data, field1, field2 }) => {
    const options = [
        { title: 'Today', id: 1 },
        { title: 'This week', id: 2 },
        { title: 'This month', id: 3 },
        { title: 'This year', id: 4 },
    ];
    const [isShowOption, setIsShowOption] = useState(false);
    const [selectedOption, setSelectedOption] = useState<{ title: string, id: number }>(options[0]);

    const checkIsClickOptionToggle = (e: any) => {
        if (e.srcElement
            && e.srcElement.parentElement
            && e.srcElement.parentElement.firstChild && e.srcElement.parentElement.firstChild.className) {
            if (e.srcElement.parentElement.firstChild.className !== 'fas fa-ellipsis-v' && e.srcElement.parentElement.firstChild.className !== 'bar-chart-containter__option__item') {
                setIsShowOption(false);
            }
        } else {
            setIsShowOption(false);
        }
    }

    useEffect(() => {
        window.addEventListener('click', checkIsClickOptionToggle, false);

        return () => {
            window.removeEventListener('click', checkIsClickOptionToggle, false);
        }
    }, [])

    return (
        <div className="bar-chart-containter">
            {isShowOption ?
                <div className="bar-chart-containter__option">
                    {options.map(option =>
                        <div
                            onClick={() => {
                                setSelectedOption(option);
                                setIsShowOption(false);
                            }}
                            className="bar-chart-containter__option__item">
                            <p>{option.title}</p>
                        </div>
                    )}
                </div>
                : null}
            <div className="bar-chart-containter__header">
                <div className="bar-chart-containter__header__left">
                    <div className="bar-chart-containter__header__left__top">
                        <h1>Conversions</h1>
                    </div>
                    <div className="bar-chart-containter__header__left__bottom">
                        <h1>{selectedOption.title}</h1>
                    </div>
                </div>
                <div
                    onClick={() => {
                        setIsShowOption(!isShowOption);
                    }}
                    className="bar-chart-containter__header__right">
                    <i className="fas fa-ellipsis-v"></i>
                </div>
            </div>
            <div className="bar-chart-containter__chart">
                <ResponsiveContainer height="80%" width="98%">
                    <BarChart
                        barSize={10}
                        data={data}>
                        <XAxis dataKey="Name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />}
                            cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                        <Bar dataKey={field1} fill="#bfdbfe" />
                        <Bar dataKey={field2} fill="#2563eb" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default Bar1;