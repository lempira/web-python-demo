import pandas as pd
from io import StringIO
import json


def file_to_dataframe(file_str):
    return pd.read_csv(StringIO(file_str))


def process_csv_file(file_str):
    df = file_to_dataframe(file_str)
    df = df.fillna("")
    return json.dumps(
        {
            "type": "single",
            "columns": list(df.columns),
            "content": df.head(20).to_dict(orient="records"),
        }
    )


def group_dataframe(file_str, groups):
    df = file_to_dataframe(file_str)
    df = df.fillna("")
    groups = json.loads(groups)
    if len(groups) == 0:
        return json.dumps(
            {
                "type": "single",
                "columns": list(df.columns),
                "content": df.to_dict(orient="records"),
            }
        )
    results = []
    for grp_name, grp in df.groupby(groups):
        if not isinstance(grp_name, str):
            grp_name = ", ".join(grp_name)
        results.append(
            {
                "groupName": grp_name,
                "group": grp.to_dict(orient="records"),
                "count": len(grp),
            }
        )
    return json.dumps(
        {
            "type": "grouped",
            "columns": list(df.columns),
            "content": sorted(results, key=lambda d: d["groupName"]),
        }
    )


class FuncContainer(object):
    pass


py_funcs = FuncContainer()
py_funcs.processCsvFile = process_csv_file
py_funcs.groupDataframe = group_dataframe

py_funcs
