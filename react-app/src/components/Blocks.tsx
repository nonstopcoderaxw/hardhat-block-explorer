import { classNames, getURLParam, URLParam } from "../utils/utils";

type Block = {
  number: number,
  timestamp: number
}

export type BlocksInputs = {
  items: Block[];
  onClick: (blockNumber: number) => void
}

export default function Blocks({items, onClick}: BlocksInputs) {

  const onClickHandler = (e) => {
    e.preventDefault();
    const blockNumber = e.currentTarget.getAttribute("data-blocknumber");
    onClick(Number(blockNumber));
    const urlParam: URLParam = getURLParam(window.location.hash);
    const bookmark = `${window.location.protocol}//${window.location.host}${window.location.pathname}#${urlParam.nab}/${urlParam.oTab}/block/${blockNumber}`;
    window.history.pushState({ path: bookmark }, '', bookmark);
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Blocks</h1>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full divide-y divide-gray-500">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                  >
                    Number
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                  >
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={item.number}>
                    <td
                      className={classNames(
                        i !== items.length - 1 ? 'border-b border-gray-200' : '',
                        'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                      )}
                    >
                      <a href="/#" className="hover:bg-gray-50" onClick={onClickHandler} data-blocknumber={item.number}>
                        {item.number}
                      </a>
                    </td>
                    <td
                      className={classNames(
                        i !== items.length - 1 ? 'border-b border-gray-200' : '',
                        'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 sm:table-cell'
                      )}
                    >
                      {item.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}


