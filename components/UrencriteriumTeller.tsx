type Props = {
  gewerkteUren: number;
  doelUren: number;
};

export default function UrencriteriumTeller({ gewerkteUren, doelUren }: Props) {
  const behaald = gewerkteUren >= doelUren;
  const verschil = Math.abs(doelUren - gewerkteUren);
  const percentage = Math.min(100, (gewerkteUren / doelUren) * 100);

  return (
    <div
      className={`rounded-xl p-5 border ${
        behaald ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"
      }`}
    >
      <p className="text-sm text-gray-600 mb-1">Urencriterium ({doelUren} uur)</p>
      <p
        className={`text-3xl font-bold ${
          behaald ? "text-green-600" : "text-red-600"
        }`}
      >
        {behaald ? `+${verschil.toFixed(1)} uur` : `${verschil.toFixed(1)} uur te gaan`}
      </p>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
        <div
          className={`h-2 rounded-full ${behaald ? "bg-green-500" : "bg-red-500"}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {gewerkteUren.toFixed(1)} / {doelUren} uur gewerkt dit boekjaar
      </p>
    </div>
  );
}
